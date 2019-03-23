import {FastifyInstance} from "fastify";


export const todoRoutes = (fastify: FastifyInstance) => {
  // we're stubbing for now - so set to null

  fastify.post('/api/v1/todo/:todoId/create', null)
  fastify.delete('/api/v1/todo/:todoId/delete', null)
  fastify.put('/api/v1/todo/:todoId/sync', null)
  fastify.post('/api/v1/todo/:todoId/addUser', null)
  fastify.post('/api/v1/todo/:todoId/removeUser', null)

  fastify.get('/api/v1/todo/read', null)
  fastify.get('/api/v1/todo/:todoId/read', null)
  fastify.get('/api/v1/todo/:todoId/item/:itemId/read', null)
  fastify.post('/api/v1/todo/:todoId/item/:itemId/create', null)
  fastify.put('/api/v1/todo/:todoId/item/:itemId/sync', null)
  fastify.delete('/api/v1/todo/:todoId/item/:itemId/delete', null)
}
