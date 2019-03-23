import './env'
import {SequelizeOptions} from "sequelize-typescript";
import path from 'path'

interface DbConfig {
  [key: string]: SequelizeOptions
}


const configs: DbConfig = {
  current: {
    database: process.env.DB_DATABASE,
    dialect: process.env.DB_DIALECT as any,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    modelPaths: [path.resolve(__dirname, '../models')],
    dialectOptions: {
      schema: process.env.DB_SCHEMA
    },
    define: {
      schema: process.env.DB_SCHEMA,
      underscored: true,
      freezeTableName: false,
    }

  },
  test: {
    database: "docker",
    dialect: "postgres",
    username: "docker",
    password: "docker",
    port: 15433,
    modelPaths: [path.resolve(__dirname, '../models')],
    dialectOptions: {
      schema: "todo"
    }
  }
}


module.exports = configs
