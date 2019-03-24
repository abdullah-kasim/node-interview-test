import test from 'ava'
import {AuthService} from "../../../src/Auth/services/AuthService";
import sinon from 'sinon'
import {User} from "../../../src/models/User";
import {UserRepository} from "../../../src/repositories/UserRepository";

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
