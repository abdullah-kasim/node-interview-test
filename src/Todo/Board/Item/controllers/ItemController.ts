import { DefaultRequestHandler } from "../../../../customTypes/fastify"
import { getJoi } from "../../../../settings/validate"
import { ResponseHelper } from "../../../../helpers/ResponseHelper"
import { ItemService } from "../services/ItemService"
import { AuthService } from "../../../../Auth/services/AuthService"

interface ItemCommonParam {
  boardId: string
  itemId: string
}

export class ItemController {
  static validateSyncOrCreate = (request, reply) => {
    const schema = getJoi()
      .object()
      .keys({
        id: getJoi()
          .string()
          .uuid()
          .required(),
        board_id: getJoi()
          .string()
          .uuid()
          .required(),
        content: getJoi()
          .string()
          .required()
      })
    const validation = schema.validate(
      {
        ...request.body,
        id: request.params.itemId,
        board_id: request.params.boardId
      },
      { abortEarly: false, allowUnknown: true }
    )
    if (validation.error !== null) {
      return ResponseHelper.validationError(request, reply, validation.error)
    }
    return true
  }

  static syncItem: DefaultRequestHandler<any, ItemCommonParam> = async (request, reply) => {
    const validation = ItemController.validateSyncOrCreate(request, reply)
    if (validation !== true) {
      return validation
    }
    const user = await AuthService.getUserFromRequest(request)
    const item = await ItemService.syncItem(user, {
      ...request.body,
      board_id: request.params.boardId,
      id: request.params.itemId
    })

    return ResponseHelper.create(request, reply, item)
  }

  static deleteItem: DefaultRequestHandler<any, ItemCommonParam> = async (request, reply) => {
    const user = await AuthService.getUserFromRequest(request)
    await ItemService.deleteItem(user, request.params.itemId)

    return ResponseHelper.ok(request, reply)
  }

  static getItems: DefaultRequestHandler<any, ItemCommonParam> = async (request, reply) => {
    const items = await ItemService.getItems(request.params.boardId)

    return ResponseHelper.create(request, reply, items)
  }

  static createItem: DefaultRequestHandler<any, ItemCommonParam> = async (request, reply) => {
    const validation = ItemController.validateSyncOrCreate(request, reply)
    if (validation !== true) {
      return validation
    }

    const user = await AuthService.getUserFromRequest(request)

    // we have to replace the payload's board id and item id - the middleware only validated those.
    const item = await ItemService.createItem(user, {
      ...request.body,
      board_id: request.params.boardId,
      id: request.params.itemId
    })

    return ResponseHelper.create(request, reply, item)
  }

  static getItem: DefaultRequestHandler<any, ItemCommonParam> = async (request, reply) => {
    const item = await ItemService.getItem(request.params.itemId)

    return ResponseHelper.create(request, reply, item)
  }
}
