import test from 'ava'
import {AuthService} from "../../../src/Auth/services/AuthService";
import sinon from 'sinon'
import {User} from "../../../src/models/User";
import {UserRepository} from "../../../src/repositories/UserRepository";
import {DeviceType} from "../../../src/models/Device";
import jwt from 'jsonwebtoken'
import {FirebaseService} from "../../../src/services/FirebaseService";
import {DeviceRepository} from "../../../src/repositories/DeviceRepository";
import moment from "moment";

test.afterEach(() => {
  sinon.restore()
})

test.serial('registers the user', async (t) => {
  const user = sinon.createStubInstance(User)

  // this should return null
  sinon.stub(UserRepository, "getUserByEmail").resolves(null)
  // this should return null too
  sinon.stub(UserRepository, "getUserByNickname").resolves(null)
  sinon.stub(UserRepository, "newUserInstance").returns(user as any)
  sinon.stub(AuthService, "hashPassword").resolves('123456')
  const registeredUser = await AuthService.register("nickname", "nickname@example.com", "123456")

  t.truthy(registeredUser.password)
  t.truthy(registeredUser.nickname)
  t.truthy(registeredUser.email)
  t.true(user.save.called)

})


test.serial('errors out when registering existing user', async (t) => {
  const user = sinon.createStubInstance(User)

  sinon.stub(UserRepository, "getUserByEmail").resolves(user as any)
  sinon.stub(UserRepository, "getUserByNickname").resolves(user as any)
  try {
    await AuthService.register("nickname", "nickname@example.com", "123456")
    t.fail()
  } catch (e) {
    t.pass()
    return
  }
})

test.serial('password is hashed', async (t) => {
  const user = sinon.createStubInstance(User)

  // this should return null
  sinon.stub(UserRepository, "getUserByEmail").resolves(null)
  // this should return null too
  sinon.stub(UserRepository, "getUserByNickname").resolves(null)
  sinon.stub(UserRepository, "newUserInstance").returns(user as any)
  const bcryptPassword = '$2b$10$9VG.ZPYCQqEtT2Wav20oJeFFpiqnsGIHGr6unsg6VfG1kecf6XpdS'

  const hashPassword = sinon.stub(AuthService, "hashPassword").resolves(bcryptPassword)

  const inputPassword = '123456'

  const registeredUser = await AuthService.register("nickname", "nickname@example.com", inputPassword)
  t.true(hashPassword.called)
  t.true(registeredUser.password === bcryptPassword)
})


test.serial('logins for web and return tokens and the user instance', async (t) => {

  const user = sinon.createStubInstance(User)
  user.id = 123
  user.password = '$2b$10$9VG.ZPYCQqEtT2Wav20oJeFFpiqnsGIHGr6unsg6VfG1kecf6XpdS'
  sinon.stub(UserRepository, "getUserByEmail").resolves(user as any)
  sinon.stub(AuthService, "createJwtToken").resolves("jwtToken")
  sinon.stub(AuthService, "createRefreshToken").resolves("refreshToken")
  sinon.stub(DeviceRepository, "addDeviceToUser").resolves(null)
  const firebaseValidateToken = sinon.stub(FirebaseService, "validateToken").resolves(true)

  const loginDetails = await AuthService.login("nickname@example.com",
    "123456",
    DeviceType.BROWSER,
    'someRandomString')

  t.truthy(loginDetails.user.id)
  t.true(!firebaseValidateToken.called)
  t.true(loginDetails.accessToken === "jwtToken")
  t.true(loginDetails.refreshToken === "refreshToken")
})

test.serial('logins for mobile and return tokens and the user instance', async (t) => {

  const user = sinon.createStubInstance(User)
  user.id = 123
  user.password = '$2b$10$9VG.ZPYCQqEtT2Wav20oJeFFpiqnsGIHGr6unsg6VfG1kecf6XpdS'
  sinon.stub(UserRepository, "getUserByEmail").resolves(user as any)
  sinon.stub(AuthService, "createJwtToken").resolves("jwtToken")
  sinon.stub(AuthService, "createRefreshToken").resolves("refreshToken")
  sinon.stub(DeviceRepository, "addDeviceToUser").resolves(null)
  const firebaseValidateToken = sinon.stub(FirebaseService, "validateToken").resolves(true)

  const loginDetails = await AuthService.login("nickname@example.com",
    "123456",
    DeviceType.MOBILE,
    'someRandomString',
    'someFirebaseToken')

  t.truthy(loginDetails.user.id)
  t.true(firebaseValidateToken.called)
  t.true(loginDetails.accessToken === "jwtToken")
  t.true(loginDetails.refreshToken === "refreshToken")
})

test.serial('creates a proper jwt token', async (t) => {

  const user = sinon.createStubInstance(User)
  user.toJSON.returns(user)
  user.id = 123
  user.email = 'nickname@example.com'
  const jwtSpy = sinon.spy(jwt, 'sign')
  const expireAt = moment().add(1, 'hour').unix()
  const loginDetails = await AuthService.createJwtToken(user as any, expireAt)
  const optionArgs =  jwtSpy.args[0][2] as any
  t.truthy(optionArgs.expiresIn)
  t.true(optionArgs.subject === "123")
  t.truthy(optionArgs.issuer)
})

