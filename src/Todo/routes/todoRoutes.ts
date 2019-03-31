import { FastifyInstance } from "fastify"
import { boardRoutes } from "../Board/routes/boardRoutes"

export const todoRoutes = (fastify: FastifyInstance) => {
  boardRoutes(fastify)
}
