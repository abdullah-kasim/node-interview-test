import {FastifyInstance} from "fastify";


export const authRoutes = (fastify: FastifyInstance) => {
  // stubbing so we'll use null for now
  fastify.get('/api/v1/auth/register', null)
  fastify.get('/api/v1/auth/login', null)
  fastify.get('/api/v1/auth/refresh', null)
  fastify.get('/api/v1/auth/logout', null)
}
