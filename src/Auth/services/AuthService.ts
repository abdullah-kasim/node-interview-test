import {Device, DeviceType} from "../../models/Device";
import {User} from "../../models/User";
import bcrypt from 'bcrypt'
import {UserRepository} from "../../repositories/UserRepository";
import {EmailAlreadyRegistered} from "./exceptions/EmailAlreadyRegistered";
import {NicknameAlreadyRegistered} from "./exceptions/NicknameAlreadyRegistered";
import {EmailNotFound} from "./exceptions/EmailNotFound";
import {WrongPassword} from "./exceptions/WrongPassword";
import {DeviceRepository} from "../../repositories/DeviceRepository";
import {RandomHelper} from "../../helpers/RandomHelper";
import jwt from 'jsonwebtoken'
import moment from "moment";
import {env} from "../../settings/env";
import firebaseAdmin from 'firebase-admin';
import {RefreshTokenExpired} from "./exceptions/RefreshTokenExpired";
import {InvalidFirebaseToken} from "./exceptions/InvalidFirebaseToken";


export class AuthService {

  static readonly ISSUER_TODO = 'todo'

  static getAuthenticatedUser = async (req) => {
    const id = req.user.sub
    return await User.findByPk(id)
  }

  static register = async (nickname, email, password) => {
    const errors = []
    const existingUserByEmail = await UserRepository.getUserByEmail(email)
    if (existingUserByEmail) {
      errors.push(new EmailAlreadyRegistered())
    }

    const existingUserByNickname = await UserRepository.getUserByNickname(nickname)

    if (existingUserByNickname) {
      errors.push(new NicknameAlreadyRegistered())
    }
    if (errors.length) {
      throw errors
    }

    const user = UserRepository.newUserInstance()
    user.email = email
    user.password = await AuthService.hashPassword(password)
    user.nickname = nickname
    await user.save()
    return user
  }

  static hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
  }

  static checkPassword = async (user: User, passwordToCheck) => {
    const hash = user.password
    return await bcrypt.compare(passwordToCheck, hash)
  }

  static login = async (email, password, type: DeviceType, deviceId, firebaseToken = null) => {
    const user = await UserRepository.getUserByEmail(email)
    if (!user) {
      throw new EmailNotFound()
    }
    const isPasswordMatch = await AuthService.checkPassword(user, password)
    if (!isPasswordMatch) {
      throw new WrongPassword()
    }
    if (type === DeviceType.MOBILE) {
      const isValidFirebaseToken = await firebaseAdmin.auth().verifyIdToken(firebaseToken)
      if (!isValidFirebaseToken) {
        throw new InvalidFirebaseToken()
      }
    }

    const [accessToken, refreshToken] = await Promise.all([
      AuthService.createJwtToken(user),
      AuthService.createRefreshToken()
    ])
    await DeviceRepository.addDeviceToUser(user, type, deviceId, firebaseToken, refreshToken)
    return {
      accessToken,
      refreshToken,
      user
    }
  }

  static createJwtToken = async (user: User, expireAt: number = null) => {
    if (!expireAt) {
      expireAt = moment().add(1, 'hour').unix()
    }
    const userJson = user.toJSON() as any
    userJson.password = null
    return await jwt.sign({
      ...userJson,
    }, env.APP_KEY, {
      expiresIn: expireAt,
      subject: userJson.id,
      issuer: AuthService.ISSUER_TODO
    })
  }

  static renewRefreshToken = async (currentRefreshToken) => {
    const device = await DeviceRepository.getDeviceByRefreshToken(currentRefreshToken)
    const isRefreshTokenValid = await AuthService.validateRefreshTokenExpiry(device, currentRefreshToken)
    if (!isRefreshTokenValid) {
      throw new RefreshTokenExpired()
    }
    const [accessToken, refreshToken] = await Promise.all([
      AuthService.createJwtToken(device.user),
      AuthService.createRefreshToken()
    ])

    device.refresh_token = refreshToken
    device.expire_at = DeviceRepository.getDeviceExpireAt()
    await device.save()

    return {
      accessToken,
      refreshToken,
      user: device.user
    }
  }
  static validateRefreshTokenExpiry = async (device: Device, refreshToken) => {
    if (!device) {
      return false
    }
    const now = moment()
    const expireAt = moment(device.expire_at)
    return !(now.isAfter(expireAt) || refreshToken !== device.refresh_token);
  }

  static createRefreshToken = async () => {
    return await RandomHelper.randomString(50)
  }

  static logoutAll = async (user: User) => {
    await Device.destroy({
      where: {
        user_id: user.id
      }
    })
    return true
  }

  static logout = async (user: User, refreshToken: string) => {
    const device = await DeviceRepository.getDeviceByRefreshToken(refreshToken)
    await device.destroy()
    return true
  }
}
