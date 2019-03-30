import {User} from "../models/User";
import {Device, DeviceType} from "../models/Device";
import {Op} from "sequelize";
import * as admin from "firebase-admin";
import moment from 'moment';


export class DeviceRepository {

  static addDeviceToUser = async (user: User, type: DeviceType, deviceId: any, firebaseToken: any, refreshToken: any) => {
    // first, delete all existing rows with the particular device id and token.
    // hopefully this is not a security issue, as getting the device id and firebase token is the device's issue.
    await Device.destroy(({
      where: {
        user_id: user.id,
        [Op.or]: [
          {
            device_id: deviceId
          },
          {
            firebase_token: firebaseToken
          }
        ]
      }
    }))
    const device = new Device();
    device.user_id = user.id
    device.type = type
    device.device_id = deviceId
    device.firebase_token = firebaseToken
    device.refresh_token = refreshToken
    // expire in 30 days? Got it!
    device.expire_at = DeviceRepository.getDefaultDeviceExpireAt()
    await device.save()
    return device
  }

  static getDefaultDeviceExpireAt = () => {
    return moment().add(30, 'days').toDate()
  }

  static getDeviceByRefreshToken = async (refreshToken) => {
    return await Device.findOne({
      include: [
        {
          model: User
        }
      ],
      where : {
        refresh_token: refreshToken
      }
    })
  }
}
