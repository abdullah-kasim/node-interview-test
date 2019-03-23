import {FastifyInstance} from "fastify";


export const todoRoutes = (fastify: FastifyInstance) => {
  // we're stubbing for now - so set to null
  fastify.post('/api/v1/auth/register', null)
}
