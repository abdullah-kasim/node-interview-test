import { FastifyInstance } from 'fastify';
import { AuthController } from '../../controllers/AuthController';
import { AuthMiddleware } from '../../middlewares/AuthMiddleware';
import { ResetPasswordController } from '../controllers/ResetPasswordController';

export const resetPasswordRoutes = (fastify: FastifyInstance) => {
  // stubbing so we'll use null for now
  fastify.post(
    '/api/v1/auth/resetPassword/sendResetEmail',
    ResetPasswordController.sendResetEmail
  );
  fastify.post(
    '/api/v1/auth/resetPassword/reset',
    ResetPasswordController.resetPassword
  );

  // fastify.post('/api/v1/auth/testMiddleware', {
  //   preHandler: [AuthMiddleware.isJwtTokenValid]
  // }, async (request, reply) => {
  //   return {hey: "yup it's valid"}
  // })
};
