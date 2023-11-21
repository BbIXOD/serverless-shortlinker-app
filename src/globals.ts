import { config } from 'dotenv'

config();

export const REGION = process.env.REGION;
export const DB_NAME = process.env.DB_NAME
export const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID
export const SECRET_ACCES_KEY = process.env.SECRET_ACCES_KEY
export const SALT_ROUNDS = process.env.SALT_ROUNDS
export const SECRET = process.env.SECRET
export const TOKEN_TTL = process.env.TOKEN_TTL
export const SERVICE_EMAIL = process.env.SERVICE_EMAIL