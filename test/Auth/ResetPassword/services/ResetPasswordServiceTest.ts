import querystring from "querystring"
import test from "ava"
import sinon from "sinon"
import moment from "moment"
import { User } from "../../../../src/models/User"
import { Device } from "../../../../src/models/Device"
import { AuthService } from "../../../../src/Auth/services/AuthService"
import { MailerService } from "../../../../src/services/MailerService"
import { ResetPasswordService } from "../../../../src/Auth/ResetPassword/services/ResetPasswordService"
import { UserRepository } from "../../../../src/repositories/UserRepository"

test.afterEach(() => {
  sinon.restore()
})

test.serial("send reset e-mail if e-mail exists", async t => {
  const email = "test@example.com"
  const sendMail = sinon.stub(MailerService, "sendMail").resolves()
  sinon.stub(ResetPasswordService, "validateEmailExists").resolves(true)
  const createResetLink = sinon.stub(ResetPasswordService, "createResetLink").returns("someResetLink")
  await ResetPasswordService.sendResetEmail(email)
  const call = sendMail.getCalls()[0]
  const arg = call.args[0]
  t.true(arg.to === "test@example.com")
  t.true(createResetLink.calledWith("test@example.com"))
})

test.serial("throws error if e-mail does not exist", async t => {
  const email = "test@example.com"
  const sendMail = sinon.stub(MailerService, "sendMail").resolves()
  sinon.stub(ResetPasswordService, "validateEmailExists").resolves(false)
  const createResetLink = sinon.stub(ResetPasswordService, "createResetLink").returns("someResetLink")
  try {
    await ResetPasswordService.sendResetEmail(email)
    t.fail()
  } catch (e) {
    t.pass()
  }
})

test.serial("generates a proper reset link", async t => {
  const email = "test@example.com"
  const sendMail = sinon.stub(MailerService, "sendMail").resolves()
  sinon.stub(ResetPasswordService, "createToken").returns("someToken")
  // how do we test that the query string is valid?
  const resetLink = ResetPasswordService.createResetLink(email)
  const queryStringPayload = querystring.parse(resetLink.split("?")[1])
  t.true(queryStringPayload.email === "test@example.com")
  t.true(queryStringPayload.type === "RESET_PASSWORD")
  t.true(queryStringPayload.token === "someToken")
})

test.serial("resets the password, given the token and password", async t => {
  const sendMail = sinon.stub(MailerService, "sendMail").resolves()
  sinon.stub(ResetPasswordService, "decryptToken").returns({
    type: "RESET_PASSWORD",
    email: "test@example.com",
    expireAt: moment().unix()
  })
  const user = sinon.createStubInstance(User)
  user.password = "someOldHash"
  sinon.stub(UserRepository, "getUserByEmail").resolves(user as any)
  sinon.stub(AuthService, "hashPassword").resolves("someBcryptHash")

  const result = await ResetPasswordService.resetPassword("newPassword", "someToken")
  t.truthy(result)
  t.true(user.save.called)
  t.true(result.password === "someBcryptHash")
})

test.serial("throws an error, given the wrong token", async t => {
  const sendMail = sinon.stub(MailerService, "sendMail").resolves()
  sinon.stub(ResetPasswordService, "decryptToken").throws()
  const user = sinon.createStubInstance(User)
  user.password = "someOldHash"
  sinon.stub(UserRepository, "getUserByEmail").resolves(user as any)
  sinon.stub(AuthService, "hashPassword").resolves("someBcryptHash")

  try {
    await ResetPasswordService.resetPassword("newPassword", "someToken")
    t.fail()
  } catch (e) {
    t.true(user.password === "someOldHash")
    t.false(user.save.called)
    t.pass()
  }
})
