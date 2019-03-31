import fastifyBase from "fastify"
import fastifyCors from "fastify-cors"
import { authRoutes } from "../Auth/routes/authRoutes"
import { todoRoutes } from "../Todo/routes/todoRoutes"

export const fastify = fastifyBase({
  logger: true
})

fastify.register(fastifyCors)

// Declare a route
fastify.get("/", async (request, reply) => {
  return { hello: "world" }
})

authRoutes(fastify)
todoRoutes(fastify)
