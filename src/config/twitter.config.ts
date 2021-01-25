import { registerAs } from "@nestjs/config"

export const TWITTER = "twitter"

export type TwitterConfig = {
  apiKey: string
  apiKeySecret: string
  bearerToken: string
  accessToken: string
  accessTokenSecret: string
}

export default registerAs<() => TwitterConfig>(TWITTER, () => ({
  apiKey: process.env.API_KEY,
  apiKeySecret: process.env.API_KEY_SECRET,
  bearerToken: process.env.BEARER_TOKEN,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
}))
