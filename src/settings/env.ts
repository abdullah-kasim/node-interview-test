import dotenv from 'dotenv'
dotenv.config()

interface Env {
  APP_URL: string
  APP_PORT: string
  NODE_ENV: string
  DB_USERNAME: string
  DB_PASSWORD: string
  DB_DATABASE: string
  DB_SCHEMA: string
  DB_HOST: string
  DB_PORT: string
  DB_DIALECT: string
  APP_KEY: string
}

export const env = process.env as any as Env
