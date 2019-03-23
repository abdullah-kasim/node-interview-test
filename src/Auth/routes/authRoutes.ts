import {FastifyInstance} from "fastify";


export const authRoutes = (fastify: FastifyInstance) => {
  // stubbing so we'll use null for now
  fastify.post('/api/v1/auth/register', null)
  fastify.post('/api/v1/auth/login', null)
  fastify.post('/api/v1/auth/refresh', null)
  fastify.post('/api/v1/auth/logout', null)
}
