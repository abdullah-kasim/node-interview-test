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
    const tokens = await Promise.all([
      AuthService.hashPassword('password123456'),
      AuthService.createRefreshToken(),
      RandomHelper.randomString(50)
    ]);
    const deviceType = devices[key % 2];

    const user = await User.create({
      nickname: `User${key + 1}`,
      email: `user${key + 1}@getnada.com`,
      password: tokens[0]
    });
    const device = await Device.create({
      user_id: user.id,
      refresh_token: tokens[1],
      type: deviceType,
      firebase_token: null,
      device_id: tokens[2],
      expire_at: moment()
        .add(1, 'year')
        .toDate()
    });
    return user;
  });

  return await Promise.all(promises);
};
