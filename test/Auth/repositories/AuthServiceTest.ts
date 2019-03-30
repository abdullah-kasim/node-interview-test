import test from 'ava';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { AuthService } from '../../../src/Auth/services/AuthService';
import { User } from '../../../src/models/User';
import { UserRepository } from '../../../src/repositories/UserRepository';
import { Device, DeviceType } from '../../../src/models/Device';
import { FirebaseService } from '../../../src/services/FirebaseService';
import { DeviceRepository } from '../../../src/repositories/DeviceRepository';

test.afterEach(() => {
  sinon.restore();
});

test.serial('registers the user', async t => {
  const user = sinon.createStubInstance(User);

  // this should return null
  sinon.stub(UserRepository, 'getUserByEmail').resolves(null);
  // this should return null too
  sinon.stub(UserRepository, 'getUserByNickname').resolves(null);
  sinon.stub(UserRepository, 'newUserInstance').returns(user as any);
  sinon.stub(AuthService, 'hashPassword').resolves('123456');
  const registeredUser = await AuthService.register(
    'nickname',
    'nickname@example.com',
    '123456'
  );

  t.truthy(registeredUser.password);
  t.truthy(registeredUser.nickname);
  t.truthy(registeredUser.email);
  t.true(user.save.called);
});

test.serial('errors out when registering existing user', async t => {
  const user = sinon.createStubInstance(User);

  sinon.stub(UserRepository, 'getUserByEmail').resolves(user as any);
  sinon.stub(UserRepository, 'getUserByNickname').resolves(user as any);
  try {
    await AuthService.register('nickname', 'nickname@example.com', '123456');
    t.fail();
  } catch (e) {
    t.pass();
  }
});

test.serial('password is hashed', async t => {
  const user = sinon.createStubInstance(User);

  // this should return null
  sinon.stub(UserRepository, 'getUserByEmail').resolves(null);
  // this should return null too
  sinon.stub(UserRepository, 'getUserByNickname').resolves(null);
  sinon.stub(UserRepository, 'newUserInstance').returns(user as any);
  const bcryptPassword =
    '$2b$10$9VG.ZPYCQqEtT2Wav20oJeFFpiqnsGIHGr6unsg6VfG1kecf6XpdS';

  const hashPassword = sinon
    .stub(AuthService, 'hashPassword')
    .resolves(bcryptPassword);

  const inputPassword = '123456';

  const registeredUser = await AuthService.register(
    'nickname',
    'nickname@example.com',
    inputPassword
  );
  t.true(hashPassword.called);
  t.true(registeredUser.password === bcryptPassword);
});

test.serial(
  'logins for web and return tokens and the user instance',
  async t => {
    const user = sinon.createStubInstance(User);
    user.id = 123;
    user.password =
      '$2b$10$9VG.ZPYCQqEtT2Wav20oJeFFpiqnsGIHGr6unsg6VfG1kecf6XpdS';
    // we're not stubbing the password function, as that's part of the business requirement
    sinon.stub(UserRepository, 'getUserByEmail').resolves(user as any);
    sinon.stub(AuthService, 'createJwtToken').resolves('jwtToken');
    sinon.stub(AuthService, 'createRefreshToken').resolves('refreshToken');
    sinon.stub(DeviceRepository, 'addDeviceToUser').resolves(null);
    const firebaseValidateToken = sinon
      .stub(FirebaseService, 'validateToken')
      .resolves(true);

    const loginDetails = await AuthService.login(
      'nickname@example.com',
      '123456',
      DeviceType.BROWSER,
      'someRandomString'
    );

    t.truthy(loginDetails.user.id);
    t.true(!firebaseValidateToken.called);
    t.true(loginDetails.accessToken === 'jwtToken');
    t.true(loginDetails.refreshToken === 'refreshToken');
  }
);

test.serial(
  'logins for mobile and return tokens and the user instance',
  async t => {
    const user = sinon.createStubInstance(User);
    user.id = 123;
    user.password =
      '$2b$10$9VG.ZPYCQqEtT2Wav20oJeFFpiqnsGIHGr6unsg6VfG1kecf6XpdS';
    sinon.stub(UserRepository, 'getUserByEmail').resolves(user as any);
    sinon.stub(AuthService, 'createJwtToken').resolves('jwtToken');
    sinon.stub(AuthService, 'createRefreshToken').resolves('refreshToken');
    sinon.stub(DeviceRepository, 'addDeviceToUser').resolves(null);
    const firebaseValidateToken = sinon
      .stub(FirebaseService, 'validateToken')
      .resolves(true);

    const loginDetails = await AuthService.login(
      'nickname@example.com',
      '123456',
      DeviceType.MOBILE,
      'someRandomString',
      'someFirebaseToken'
    );

    t.truthy(loginDetails.user.id);
    t.true(firebaseValidateToken.called);
    t.true(loginDetails.accessToken === 'jwtToken');
    t.true(loginDetails.refreshToken === 'refreshToken');
  }
);

test.serial('creates a proper jwt token', async t => {
  const user = sinon.createStubInstance(User);
  const device = sinon.createStubInstance(Device);
  device.id = 456;
  user.toJSON.returns(user);
  user.id = 123;
  user.email = 'nickname@example.com';
  const jwtSpy = sinon.spy(jwt, 'sign');
  const expireAt = moment()
    .add(1, 'hour')
    .unix();
  const loginDetails = await AuthService.createJwtToken(
    user as any,
    device as any,
    expireAt
  );
  const optionArgs = jwtSpy.args[0][2] as any;
  t.true(optionArgs.expiresIn !== expireAt);
  t.true(optionArgs.subject === '123');
  t.truthy(optionArgs.issuer);
});

test.serial('returns access tokens when refreshed', async t => {
  const device = sinon.createStubInstance(Device);
  const currentRefreshToken = 'currentRefreshToken';
  sinon
    .stub(DeviceRepository, 'getDeviceByRefreshToken')
    .resolves(device as any);
  sinon.stub(AuthService, 'validateRefreshTokenExpiry').resolves(true);

  const jwtTokenStub = sinon
    .stub(AuthService, 'createJwtToken')
    .resolves('newJwtToken');

  sinon.stub(AuthService, 'createRefreshToken').resolves('newRefreshToken');
  const expireAtCall = sinon
    .stub(DeviceRepository, 'getDefaultDeviceExpireAt')
    .returns(new Date());
  const jwt = await AuthService.renewRefreshToken(currentRefreshToken);
  t.true(jwt.accessToken === 'newJwtToken');
  t.true(jwt.refreshToken === 'newRefreshToken');
  t.true(expireAtCall.called);
  t.true(jwtTokenStub.calledWith(device.user, device));
  t.deepEqual(jwt.user, device.user);
});

test.serial('throws error if refresh token is invalid', async t => {
  const device = sinon.createStubInstance(Device);
  const currentRefreshToken = 'currentRefreshToken';
  sinon
    .stub(DeviceRepository, 'getDeviceByRefreshToken')
    .resolves(device as any);
  sinon.stub(AuthService, 'validateRefreshTokenExpiry').resolves(false);

  sinon.stub(AuthService, 'createRefreshToken').resolves('newRefreshToken');
  sinon.stub(DeviceRepository, 'getDefaultDeviceExpireAt').returns(new Date());
  try {
    const jwt = await AuthService.renewRefreshToken(currentRefreshToken);
    t.fail();
  } catch (e) {
    t.pass();
  }
});

test.serial('logout the user for this particular device', async t => {
  const user = sinon.createStubInstance(User);
  const device = sinon.createStubInstance(Device);
  const response = await AuthService.logout(user as any, device as any);
  t.true(response);
  t.true(device.destroy.called);
});

test.serial('logout the user for all devices', async t => {
  const user = sinon.createStubInstance(User);
  user.id = 123;
  const destroyDeviceStub = sinon.stub(Device, 'destroy').resolves();
  const response = await AuthService.logoutAll(user as any);
  t.true(response);
  t.true(
    destroyDeviceStub.calledWithExactly({
      where: {
        user_id: 123
      }
    })
  );
});
