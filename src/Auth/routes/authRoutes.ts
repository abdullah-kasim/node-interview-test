import { FastifyInstance } from "fastify"
import { AuthController } from "../controllers/AuthController"
import { AuthMiddleware } from "../middlewares/AuthMiddleware"
import { resetPasswordRoutes } from "../ResetPassword/routes/resetPasswordRoutes"

export const authRoutes = (fastify: FastifyInstance) => {
  // stubbing so we'll use null for now
  const authOpts = { preHandler: [AuthMiddleware.isJwtTokenValid] }

  fastify.post("/api/v1/auth/register", AuthController.register)
  fastify.post("/api/v1/auth/registerUsingFirebase", AuthController.registerUsingFirebase)

  fastify.post("/api/v1/auth/updateFirebaseCloudToken", authOpts, AuthController.updateFirebaseCloudToken)

  fastify.post("/api/v1/auth/login", AuthController.login)
  fastify.post("/api/v1/auth/loginUsingFirebase", AuthController.loginUsingFirebase)
  fastify.post("/api/v1/auth/refresh", AuthController.refresh)
  fastify.post("/api/v1/auth/logout", authOpts, AuthController.logout)

  resetPasswordRoutes(fastify)

  // fastify.post('/api/v1/auth/testMiddleware', {
  //   preHandler: [AuthMiddleware.isJwtTokenValid]
  // }, async (request, reply) => {
  //   return {hey: "yup it's valid"}
  // })
}
