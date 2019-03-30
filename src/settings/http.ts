import fastifyBase from 'fastify';
import { authRoutes } from '../Auth/routes/authRoutes';
import { todoRoutes } from '../Todo/routes/todoRoutes';

export const fastify = fastifyBase({
  logger: true
});

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

authRoutes(fastify);
todoRoutes(fastify);
