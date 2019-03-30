import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

export const authRoutes = (fastify: FastifyInstance) => {
  // stubbing so we'll use null for now
  fastify.post('/api/v1/auth/register', AuthController.register);
  fastify.post('/api/v1/auth/login', AuthController.login);
  fastify.post('/api/v1/auth/refresh', AuthController.refresh);
  fastify.post(
    '/api/v1/auth/logout',
    { preHandler: [AuthMiddleware.isJwtTokenValid] },
    AuthController.logout
  );

  // fastify.post('/api/v1/auth/testMiddleware', {
  //   preHandler: [AuthMiddleware.isJwtTokenValid]
  // }, async (request, reply) => {
  //   return {hey: "yup it's valid"}
  // })
};
