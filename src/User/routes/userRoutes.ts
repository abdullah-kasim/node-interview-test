import { FastifyInstance } from "fastify"
import { UserController } from "../controllers/UserController"
import { AuthMiddleware } from "../../Auth/middlewares/AuthMiddleware"

export const userRoutes = (fastify: FastifyInstance) => {
  // stubbing so we'll use null for now
  fastify.get(
    "/api/v1/user/get",
    {
      preHandler: [AuthMiddleware.isJwtTokenValid]
    },
    UserController.getUsers
  )
}
