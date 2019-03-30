import path from 'path';
import dotenv from 'dotenv';

interface Env {
  APP_KEY: string;
  APP_PORT: string;
  APP_URL: string;
  DB_DATABASE: string;
  DB_DIALECT: string;
  DB_HOST: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_SCHEMA: string;
  DB_USERNAME: string;
  EMAIL_ADDRESS: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SECURE: string;
}

export const env = (dotenv.config({
  path: path.resolve(__dirname, '../../.env')
}).parsed as any) as Env;
