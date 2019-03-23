import fastifyBase from 'fastify'
import {AddressInfo} from "net";
import {sequelize} from "./settings/db";
import {fastify} from "./settings/http";
import './settings/env'


// Run the server!
const start = async () => {
  try {
    await sequelize.authenticate()
    await fastify.listen(process.env.APP_PORT)
    const address = fastify.server.address() as AddressInfo

    fastify.log.info(`server listening on ${address.port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start().then().catch()
