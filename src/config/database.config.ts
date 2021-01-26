import { registerAs } from "@nestjs/config"

export const DATABASE = "DATABASE"

export type DatabaseConfig = {
  type: "postgres"
  url?: string
  name?: string
  username?: string
  password?: string
}

export default registerAs<() => DatabaseConfig>(DATABASE, () => ({
  type: "postgres",
  url: process.env.DATABASE_URL,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
}))
