import { FindOptions, Op } from "sequelize"
import { User } from "../models/User"
import { Device } from "../models/Device"

export class UserRepository {
  static getUserByEmail = async (email: string, withDevices = false) => {
    const options: FindOptions = {
      where: {
        email
      }
    }
    if (withDevices) {
      options.include = [
        {
          model: Device
        }
      ]
    }

    return await User.findOne(options)
  }

  static newUserInstance = () => {
    return new User()
  }

  static getUsers = async partialNickname => {
    const limit = 100
    if (!partialNickname) {
      return await User.findAll({
        limit
      })
    }
    const search = `%${partialNickname}%`
    return await User.findAll({
      where: {
        nickname: {
          [Op.iLike]: search
        }
      },
      attributes: ["id", "nickname"],
      limit
    })
  }

  static getUserByNickname = async (nickname: string) => {
    return await User.findOne({
      where: {
        nickname
      }
    })
  }
}
