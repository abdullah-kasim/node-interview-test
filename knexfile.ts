import {Config} from "knex";
import {env} from "./src/settings/env";
import path from 'path'

// map from sequelize wording to knex wording
const databaseMap = {
  postgres: 'postgresql'
}

const config: Config = {
  client: databaseMap[env.DB_DIALECT],
  connection: {
    database: env.DB_DATABASE,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    port: parseInt(env.DB_PORT)
  },
  searchPath: env.DB_SCHEMA,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: path.resolve(__dirname, './src/migrations'),
    tableName: "knex_migrations"
  }
}

module.exports = {
  development: config,
  testing: {
    ...config,
    connection: {
      // database would be dynamic later. Need to figure out how to do it in knex
      database: "todo",
      user: "postgres",
      password: "docker"
    }
  },
  production: config,
}
