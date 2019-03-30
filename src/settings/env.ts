import dotenv from 'dotenv';

dotenv.config();

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

export const env = (process.env as any) as Env;
