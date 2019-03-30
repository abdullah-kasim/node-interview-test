import path from 'path';
import { SequelizeOptions } from 'sequelize-typescript';
import { env } from './env';

interface DbConfig {
  [key: string]: SequelizeOptions;
}

export const configs: DbConfig = {
  current: {
    database: env.DB_DATABASE,
    dialect: env.DB_DIALECT as any,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    port: parseInt(env.DB_PORT, 10),
    modelPaths: [path.resolve(__dirname, '../models')],
    dialectOptions: {
      schema: process.env.DB_SCHEMA
    },
    define: {
      schema: process.env.DB_SCHEMA,
      underscored: true,
      freezeTableName: false
    }
  },
  test: {
    database: 'docker',
    dialect: 'postgres',
    username: 'docker',
    password: 'docker',
    port: 15433,
    modelPaths: [path.resolve(__dirname, '../models')],
    dialectOptions: {
      schema: 'todo'
    }
  }
};
