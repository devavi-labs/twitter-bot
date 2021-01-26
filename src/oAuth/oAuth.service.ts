import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createHmac } from "crypto"
import OAuth from "oauth-1.0a"
import { TWITTER, TwitterConfig } from "src/config/twitter.config"

@Injectable()
export class OAuthService {
  constructor(private readonly configSerivce: ConfigService) {}

  private token: OAuth.Token = {
    key: this.configSerivce.get<TwitterConfig>(TWITTER).accessToken,
    secret: this.configSerivce.get<TwitterConfig>(TWITTER).accessTokenSecret,
  }

  oAuth01aHeader = (url: string, method: string, data?: any): string => {
    const oauth = new OAuth({
      consumer: {
        key: this.configSerivce.get<TwitterConfig>(TWITTER).apiKey,
        secret: this.configSerivce.get<TwitterConfig>(TWITTER).apiKeySecret,
      },
      signature_method: "HMAC-SHA1",
      hash_function: (baseString, key) =>
        createHmac("sha1", key).update(baseString).digest("base64"),
    })
    return oauth.toHeader(oauth.authorize({ url, method, data }, this.token))[
      "Authorization"
    ]
  }

  get oAuth02aHeader(): string {
    return `Bearer ${
      this.configSerivce.get<TwitterConfig>(TWITTER).bearerToken
    }`
  }
}
