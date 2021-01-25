import { registerAs } from "@nestjs/config"

export const GLOBAL = "global"

export type GlobalConfig = {
  origin: string
}

export default registerAs<() => GlobalConfig>(GLOBAL, () => ({
  origin: process.env.ORIGIN,
}))
