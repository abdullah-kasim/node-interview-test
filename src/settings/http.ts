import fastifyBase from 'fastify'


export const fastify = fastifyBase({
  logger: true
})

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})
