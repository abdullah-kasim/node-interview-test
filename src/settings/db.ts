import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { configs } from './dbConfig';
import { env } from './env';

export const sequelize = new Sequelize({
  database: env.DB_DATABASE,
  dialect: env.DB_DIALECT as any,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  port: parseInt(env.DB_PORT, 10),
  modelPaths: [path.resolve(__dirname, '../models')],
  dialectOptions: {
    schema: env.DB_SCHEMA
  },
  define: {
    schema: env.DB_SCHEMA,
    underscored: true,
    freezeTableName: false
  }
});
