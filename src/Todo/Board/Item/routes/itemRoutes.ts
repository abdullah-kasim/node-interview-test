import { FastifyInstance } from 'fastify';
import { ItemController } from '../controllers/ItemController';
import { AuthService } from '../../../../Auth/services/AuthService';
import { AuthMiddleware } from '../../../../Auth/middlewares/AuthMiddleware';
import { ItemMiddleware } from '../middlewares/ItemMiddleware';

export const itemRoutes = (fastify: FastifyInstance, basePrefix) => {
  // should probably globalize the prefix. We'll see
  const prefix = `${basePrefix}/item`;
  const prefixWithId = `${basePrefix}/item/:itemId`;
  const opts = {
    preHandler: [AuthMiddleware.isJwtTokenValid, ItemMiddleware.itemIsEditable]
  };
  fastify.get(`${prefix}/get`, opts, ItemController.getItems);
  fastify.get(`${prefixWithId}/get`, opts, ItemController.getItem);
  fastify.post(`${prefixWithId}/create`, opts, ItemController.createItem);
  fastify.put(`${prefixWithId}/sync`, opts, ItemController.syncItem);
  fastify.delete(`${prefixWithId}/delete`, opts, ItemController.deleteItem);

  // fastify.get(`/api/v1/todo/read`, null)
  // fastify.get(`${prefixWithId}/read`, null)
  // fastify.get(`${prefixWithId}/item/:itemId/read`, null)
  // fastify.post(`${prefixWithId}/item/:itemId/create`, null)
  // fastify.put(`${prefixWithId}/item/:itemId/sync`, null)
  // fastify.delete(`${prefixWithId}/item/:itemId/delete`, null)
};
