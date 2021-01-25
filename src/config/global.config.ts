import { registerAs } from "@nestjs/config"

export const GLOBAL = "global"

export type GlobalConfig = {
  origin: string
  prod: boolean
}

export default registerAs<() => GlobalConfig>(GLOBAL, () => ({
  origin: process.env.ORIGIN,
  prod: process.env.NODE_ENV === "production",
}))
