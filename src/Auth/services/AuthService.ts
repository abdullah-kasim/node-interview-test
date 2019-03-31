import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import moment from "moment"
import { Device, DeviceType } from "../../models/Device"
import { User } from "../../models/User"
import { UserRepository } from "../../repositories/UserRepository"
import { DeviceRepository } from "../../repositories/DeviceRepository"
import { RandomHelper } from "../../helpers/RandomHelper"
import { env } from "../../settings/env"
import { FirebaseService } from "../../services/FirebaseService"
import { AuthHeader } from "../constants/AuthHeader"
import { EmailAlreadyRegistered } from "./exceptions/EmailAlreadyRegistered"
import { NicknameAlreadyRegistered } from "./exceptions/NicknameAlreadyRegistered"
import { EmailNotFound } from "./exceptions/EmailNotFound"
import { WrongPassword } from "./exceptions/WrongPassword"
import { RefreshTokenExpired } from "./exceptions/RefreshTokenExpired"
import { InvalidFirebaseToken } from "./exceptions/InvalidFirebaseToken"
import { InvalidFirebaseCloudToken } from "./exceptions/InvalidFirebaseCloudToken"

export class AuthService {
  static readonly ISSUER_TODO = "todo"

  static registerUsingFirebase = async (nickname, firebaseToken) => {
    const errors = []
    const firebaseUser = await FirebaseService.getUser(firebaseToken)
    const existingUserByEmail = await UserRepository.getUserByEmail(firebaseUser.email)
    if (existingUserByEmail) {
      errors.push(new EmailAlreadyRegistered())
    }

    const existingUserByNickname = await UserRepository.getUserByNickname(nickname)

    if (existingUserByNickname) {
      errors.push(new NicknameAlreadyRegistered())
    }

    if (errors.length > 0) {
      throw errors
    }

    const user = UserRepository.newUserInstance()
    user.email = firebaseUser.email
    user.password = null
    user.nickname = nickname
    user.is_firebase_account = true
    await user.save()
    return user
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

    if (errors.length > 0) {
      throw errors
    }

    const user = UserRepository.newUserInstance()
    user.email = email
    user.password = await AuthService.hashPassword(password)
    user.nickname = nickname
    await user.save()
    return user
  }

  static hashPassword = async password => {
    return await bcrypt.hash(password, 10)
  }

  static checkPassword = async (user: User, passwordToCheck) => {
    const hash = user.password
    return await bcrypt.compare(passwordToCheck, hash)
  }

  static loginUsingFirebase = async (firebaseToken, type: DeviceType, deviceId, firebaseCloudToken = null) => {
    const firebaseUser = await FirebaseService.getUser(firebaseToken)
    if (!firebaseUser) {
      throw new InvalidFirebaseToken()
    }
    const user = await UserRepository.getUserByEmail(firebaseUser.email)
    if (!user) {
      throw new EmailNotFound()
    }

    if (type === DeviceType.MOBILE) {
      if (!firebaseCloudToken) {
        throw new InvalidFirebaseCloudToken()
      }
    }

    const [refreshToken] = await Promise.all([AuthService.createRefreshToken()])

    const device = await DeviceRepository.addDeviceToUser(user, type, deviceId, firebaseCloudToken, refreshToken)

    const accessToken = await AuthService.createJwtToken(user, device)
    return {
      accessToken,
      refreshToken,
      user
    }
  }

  static login = async (email, password, type: DeviceType, deviceId, firebaseCloudToken = null) => {
    const user = await UserRepository.getUserByEmail(email)
    if (!user) {
      throw new EmailNotFound()
    }

    const isPasswordMatch = await AuthService.checkPassword(user, password)
    if (!isPasswordMatch) {
      throw new WrongPassword()
    }

    if (type === DeviceType.MOBILE) {
      if (!firebaseCloudToken) {
        throw new InvalidFirebaseCloudToken()
      }
    }

    const [refreshToken] = await Promise.all([AuthService.createRefreshToken()])
    const device = await DeviceRepository.addDeviceToUser(user, type, deviceId, firebaseCloudToken, refreshToken)
    const accessToken = await AuthService.createJwtToken(user, device)
    return {
      accessToken,
      refreshToken,
      user
    }
  }

  static cleanDevice = (device: Device) => {
    return {
      id: device.id
    }
  }

  static createJwtToken = async (user: User, device: Device, expireAt: number = null) => {
    if (!expireAt) {
      expireAt = moment()
        .add(1, "hour")
        .unix()
    }

    const expiresIn = expireAt - moment().unix()

    return await jwt.sign(
      {
        device: AuthService.cleanDevice(device)
      },
      env.APP_KEY,
      {
        expiresIn,
        subject: `${user.id}`,
        issuer: AuthService.ISSUER_TODO
      }
    )
  }

  static verifyAndGetJwtToken = token => {
    return jwt.verify(token, env.APP_KEY)
  }

  static getUserFromRequest = async req => {
    const authorizationHeader = req.headers[AuthHeader.FRONTEND_TOKEN] as string
    if (!authorizationHeader) {
      return null
    }
    try {
      const jwt = AuthService.verifyAndGetJwtToken(authorizationHeader) as any
      return await User.findByPk(jwt.sub, {
        include: [
          {
            model: Device,
            where: {
              id: jwt.device.id
            }
          }
        ]
      })
    } catch (e) {
      return null
    }
  }

  static cleanUser = (user: User) => {
    const { password: _p, ...userWithoutSensitive } = user.toJSON() as any
    return userWithoutSensitive
  }

  static renewRefreshToken = async currentRefreshToken => {
    const device = await DeviceRepository.getDeviceByRefreshToken(currentRefreshToken)
    const isRefreshTokenValid = await AuthService.validateRefreshTokenExpiry(device, currentRefreshToken)
    if (!isRefreshTokenValid) {
      throw new RefreshTokenExpired()
    }

    const [refreshToken] = await Promise.all([AuthService.createRefreshToken()])

    device.refresh_token = refreshToken
    device.expire_at = DeviceRepository.getDefaultDeviceExpireAt()
    await device.save()
    const accessToken = await AuthService.createJwtToken(device.user, device)
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
    return !(now.isAfter(expireAt) || refreshToken !== device.refresh_token)
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

  static getUserByRefreshToken = async (refreshToken: string) => {
    const device = await DeviceRepository.getDeviceByRefreshToken(refreshToken)
    return device.user
  }

  static logout = async (user: User, device: Device) => {
    await device.destroy()
    return true
  }

  static updateFirebaseCloudToken = async (device: Device, firebaseCloudToken: string) => {
    device.firebase_cloud_token = firebaseCloudToken
    await device.save()
    return device
  }
}
