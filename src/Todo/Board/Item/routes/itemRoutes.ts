import { FastifyInstance } from "fastify"
import { ItemController } from "../controllers/ItemController"
import { AuthService } from "../../../../Auth/services/AuthService"
import { AuthMiddleware } from "../../../../Auth/middlewares/AuthMiddleware"
import { ItemMiddleware } from "../middlewares/ItemMiddleware"
import { BoardMiddleware } from "../../middlewares/BoardMiddleware"

export const itemRoutes = (fastify: FastifyInstance, basePrefix) => {
  // should probably globalize the prefix. We'll see
  const prefix = `${basePrefix}/item`
  const prefixWithId = `${basePrefix}/item/:itemId`
  const opt = {
    preHandler: [AuthMiddleware.isJwtTokenValid, ItemMiddleware.itemIsEditable]
  }
  const boardOpt = {
    preHandler: [AuthMiddleware.isJwtTokenValid, BoardMiddleware.userIsMemberOfBoard]
  }
  fastify.get(`${prefix}/get`, boardOpt, ItemController.getItems)
  fastify.get(`${prefixWithId}/get`, opt, ItemController.getItem)
  fastify.post(`${prefixWithId}/create`, boardOpt, ItemController.createItem)
  fastify.put(`${prefixWithId}/sync`, opt, ItemController.syncItem)
  fastify.delete(`${prefixWithId}/delete`, opt, ItemController.deleteItem)

  // fastify.get(`/api/v1/todo/read`, null)
  // fastify.get(`${prefixWithId}/read`, null)
  // fastify.get(`${prefixWithId}/item/:itemId/read`, null)
  // fastify.post(`${prefixWithId}/item/:itemId/create`, null)
  // fastify.put(`${prefixWithId}/item/:itemId/sync`, null)
  // fastify.delete(`${prefixWithId}/item/:itemId/delete`, null)
}
