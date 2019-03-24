import test from 'ava'
import {AuthService} from "../../../src/Auth/services/AuthService";
import sinon from 'sinon'
import {User} from "../../../src/models/User";
import {UserRepository} from "../../../src/repositories/UserRepository";



test('registers the user', async (t) => {
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
