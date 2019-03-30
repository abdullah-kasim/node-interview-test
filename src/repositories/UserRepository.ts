import {User} from "../models/User";
import {FindOptions} from "sequelize";
import {Device} from "../models/Device";


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

  static getUserByNickname = async (nickname: string) => {
    return await User.findOne({
      where: {
        nickname
      }
    })
  }
}
