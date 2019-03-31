import { FastifyInstance } from 'fastify';
import { BoardController } from '../controllers/BoardController';
import { AuthMiddleware } from '../../../Auth/middlewares/AuthMiddleware';
import { BoardMiddleware } from '../middlewares/BoardMiddleware';

export const boardRoutes = (fastify: FastifyInstance) => {
  // we're stubbing for now - so set to null

  const prefix = `/api/v1/todo/board`;
  const prefixWithId = `${prefix}/:boardId`;

  // should we try to make the middleware DRYer?
  // not enough time to learn how fastify works. Why does the middleware have different methods compared to a handler?
  fastify.get(
    `${prefix}/get`,
    {
      preHandler: [AuthMiddleware.isJwtTokenValid]
    },
    BoardController.getBoards
  );

  fastify.get(
    `${prefixWithId}/get`,
    {
      preHandler: [
        AuthMiddleware.isJwtTokenValid,
        BoardMiddleware.userIsMemberOfBoard
      ]
    },
    BoardController.getBoard
  );

  fastify.post(
    `${prefixWithId}/create`,
    {
      preHandler: [AuthMiddleware.isJwtTokenValid]
    },
    BoardController.createBoard
  );

  fastify.delete(
    `${prefixWithId}/delete`,
    {
      preHandler: [
        AuthMiddleware.isJwtTokenValid,
        BoardMiddleware.boardBelongsToUser
      ]
    },
    BoardController.deleteBoard
  );

  fastify.put(
    `${prefixWithId}/sync`,
    {
      preHandler: [
        AuthMiddleware.isJwtTokenValid,
        BoardMiddleware.boardBelongsToUser
      ]
    },
    BoardController.syncBoard
  );

  fastify.post(
    `${prefixWithId}/addUser`,
    {
      preHandler: [
        AuthMiddleware.isJwtTokenValid,
        BoardMiddleware.boardBelongsToUser
      ]
    },
    BoardController.addUserToBoard
  );

  fastify.post(
    `${prefixWithId}/removeUser`,
    {
      preHandler: [
        AuthMiddleware.isJwtTokenValid,
        BoardMiddleware.boardBelongsToUser
      ]
    },
    BoardController.addUserToBoard
  );

  // fastify.get(`/api/v1/todo/read`, null)
  // fastify.get(`${prefixWithId}/read`, null)
  // fastify.get(`${prefixWithId}/item/:itemId/read`, null)
  // fastify.post(`${prefixWithId}/item/:itemId/create`, null)
  // fastify.put(`${prefixWithId}/item/:itemId/sync`, null)
  // fastify.delete(`${prefixWithId}/item/:itemId/delete`, null)
};
