import { FastifyInstance } from "fastify"
import { BoardController } from "../controllers/BoardController"
import { AuthMiddleware } from "../../../Auth/middlewares/AuthMiddleware"
import { BoardMiddleware } from "../middlewares/BoardMiddleware"
import { itemRoutes } from "../Item/routes/itemRoutes"

export const boardRoutes = (fastify: FastifyInstance) => {
  // we're stubbing for now - so set to null

  const prefix = `/api/v1/todo/board`
  const prefixWithId = `${prefix}/:boardId`
  const authOpt = {
    preHandler: [AuthMiddleware.isJwtTokenValid]
  }

  const memberOpt = {
    preHandler: [AuthMiddleware.isJwtTokenValid, BoardMiddleware.userIsMemberOfBoard]
  }

  const ownerOpt = {
    preHandler: [AuthMiddleware.isJwtTokenValid, BoardMiddleware.boardBelongsToUser]
  }

  // should we try to make the middleware DRYer?
  // not enough time to learn how fastify works. Why does the middleware have different methods compared to a handler?
  fastify.get(`${prefix}/get`, authOpt, BoardController.getBoards)

  fastify.get(`${prefixWithId}/get`, memberOpt, BoardController.getBoard)

  fastify.post(`${prefixWithId}/create`, authOpt, BoardController.createBoard)

  fastify.delete(`${prefixWithId}/delete`, ownerOpt, BoardController.deleteBoard)

  fastify.put(`${prefixWithId}/sync`, ownerOpt, BoardController.syncBoard)

  fastify.post(`${prefixWithId}/addUser`, ownerOpt, BoardController.addUserToBoard)

  fastify.post(`${prefixWithId}/removeUser`, ownerOpt, BoardController.addUserToBoard)
  itemRoutes(fastify, prefixWithId)

  // fastify.get(`/api/v1/todo/read`, null)
  // fastify.get(`${prefixWithId}/read`, null)
  // fastify.get(`${prefixWithId}/item/:itemId/read`, null)
  // fastify.post(`${prefixWithId}/item/:itemId/create`, null)
  // fastify.put(`${prefixWithId}/item/:itemId/sync`, null)
  // fastify.delete(`${prefixWithId}/item/:itemId/delete`, null)
}
