import fastifyBase from 'fastify'
import {AddressInfo} from "net";
import {sequelize} from "./settings/db";

const fastify = fastifyBase({
  logger: true
})

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

// Run the server!
const start = async () => {
  try {
    await sequelize.authenticate()
    await fastify.listen(3000)
    const address = fastify.server.address() as AddressInfo

    fastify.log.info(`server listening on ${address.port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start().then().catch()
