import { Op } from "sequelize"
import * as _ from "lodash"
import { Item } from "../../../../models/Item"
import { User } from "../../../../models/User"
import { Board } from "../../../../models/Board"
import { FirebaseService } from "../../../../services/FirebaseService"
import { Device } from "../../../../models/Device"

enum PushType {
  CREATE = "CREATE",
  DELETE = "DELETE",
  SYNC = "SYNC"
}

export class ItemService {
  static validateItemEditable = async (user: User, itemId: string, boardId: string) => {
    const itemEditableByUser = await Item.findOne({
      include: [
        {
          model: Board,
          include: [
            {
              model: User,
              where: {
                id: user.id
              },
              required: true
            }
          ],
          where: {
            id: boardId
          },
          required: true
        }
      ],
      where: {
        id: itemId
      }
    })
    return itemEditableByUser !== null
  }

  static sendPushMessage = async (user: User, type: PushType, item: Item) => {
    let { board } = item
    if (!board) {
      board = (await item.$get("board")) as any
    }
    const usersToSendTo = await User.findAll({
      include: [
        {
          model: Device,
          where: {
            firebase_cloud_token: {
              [Op.ne]: null
            }
          },
          required: true
        },
        {
          model: Board,
          where: {
            board_id: item.board_id
          },
          required: true
        }
      ],
      where: {
        id: {
          [Op.ne]: user.id
        }
      }
    })
    const payload = {
      ...item.toJSON(),
      type,
      board: board.toJSON()
    }
    const cloudTokens = _.flatMap(usersToSendTo, user => {
      return user.devices
    }).map(device => device.firebase_cloud_token)
    if (cloudTokens.length === 0) {
      return
    }
    return await FirebaseService.sendMessage(cloudTokens, payload)
  }

  /**
   * @param item
   */
  static cleanItem = (item: Partial<Item>) => {
    const { createdAt, updatedAt, ...otherItemParams } = item
    return otherItemParams
  }

  static createItem = async (user: User, item: Partial<Item>) => {
    const createdItem = await Item.create(ItemService.cleanItem(item))

    ItemService.sendPushMessage(user, PushType.CREATE, createdItem)
      .then()
      .catch()

    return createdItem
  }

  static syncItem = async (user: User, item: Partial<Item>) => {
    await Item.upsert(ItemService.cleanItem(item))
    const upsertedItem = await Item.findByPk(item.id)

    ItemService.sendPushMessage(user, PushType.SYNC, upsertedItem)
      .then()
      .catch()

    return upsertedItem
  }

  static deleteItem = async (user: User, itemId: string) => {
    const item = await Item.findOne({
      include: [
        {
          model: Board
        }
      ],
      where: {
        id: itemId
      }
    })
    ItemService.sendPushMessage(user, PushType.DELETE, item)
      .then()
      .catch()

    if (item) {
      await item.destroy()
    }

    return true
  }

  static getItems = async (boardId: string) => {
    return await Item.findAll({
      where: {
        board_id: boardId
      }
    })
  }

  static getItem = async (itemId: string) => {
    return await Item.findByPk(itemId)
  }
}
