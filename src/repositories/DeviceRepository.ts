import { Op } from "sequelize"
import * as admin from "firebase-admin"
import moment from "moment"
import { Device, DeviceType } from "../models/Device"
import { User } from "../models/User"

export class DeviceRepository {
  static addDeviceToUser = async (
    user: User,
    type: DeviceType,
    deviceId: any,
    firebaseCloudToken: any,
    refreshToken: any
  ) => {
    // first, delete all existing rows with the particular device id and token.
    // hopefully this is not a security issue, as getting the device id and firebase token is the device's issue.
    const firebaseCloudTokenWhere = firebaseCloudToken
      ? [
          {
            firebase_cloud_token: firebaseCloudToken
          }
        ]
      : []

    await Device.destroy({
      where: {
        [Op.or]: [
          {
            device_id: deviceId
          },
          ...firebaseCloudTokenWhere
        ]
      }
    })
    const device = new Device()
    device.user_id = user.id
    device.type = type
    device.device_id = deviceId
    device.firebase_cloud_token = firebaseCloudToken
    device.refresh_token = refreshToken
    // expire in 30 days? Got it!
    device.expire_at = DeviceRepository.getDefaultDeviceExpireAt()
    const newDevice = await device.save()
    return await newDevice
  }

  static getDefaultDeviceExpireAt = () => {
    return moment()
      .add(30, "days")
      .toDate()
  }

  static getDeviceByRefreshToken = async refreshToken => {
    return await Device.findOne({
      include: [
        {
          model: User
        }
      ],
      where: {
        refresh_token: refreshToken
      }
    })
  }
}
