import * as Knex from 'knex';
import moment from 'moment';
import { User } from '../models/User';
import { AuthService } from '../Auth/services/AuthService';
import { Device, DeviceType } from '../models/Device';
import { RandomHelper } from '../helpers/RandomHelper';
import { sequelize } from '../settings/db';

exports.seed = async function(knex: Knex): Promise<any> {
  await sequelize.authenticate();
  await knex.raw('truncate table users, devices cascade');
  const devices = [DeviceType.BROWSER, DeviceType.MOBILE];

  const promises = [...new Array(5).keys()].map(async key => {
    const user = await User.create({
      nickname: `User${key + 1}`,
      email: `user${key + 1}@getnada.com`,
      password: await AuthService.hashPassword('password123456')
    });
    const expireAt = moment()
      .add(1, 'year')
      .toDate();
    const devicesToCreate = [...new Array(2).keys()].map(async key => {
      return await Device.create({
        user_id: user.id,
        refresh_token: await AuthService.createRefreshToken(),
        type: devices[key % 2],
        firebase_token: null,
        device_id: await RandomHelper.randomString(),
        expire_at: expireAt
      });
    });
    await Promise.all(devicesToCreate);
    return user;
  });

  return await Promise.all(promises);
};
