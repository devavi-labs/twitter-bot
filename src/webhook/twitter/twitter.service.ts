import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createHmac } from "crypto"
import { TWITTER, TwitterConfig } from "src/config/twitter.config"
import { WebhookIdDto } from "./webhookIdDto"
import { writeFileSync, readFileSync } from "fs"
import { join } from "path"
import { GLOBAL, GlobalConfig } from "src/config/global.config"
import { post, put } from "request"
import { Constants } from "src/utils/constants"

@Injectable()
export class TwitterService {
  constructor(
    private readonly configSerivce: ConfigService,
    private readonly constants: Constants
  ) {}

  oauth = {
    consumer_key: this.configSerivce.get<TwitterConfig>(TWITTER).apiKey,
    consumer_secret: this.configSerivce.get<TwitterConfig>(TWITTER)
      .apiKeySecret,
    token: this.configSerivce.get<TwitterConfig>(TWITTER).accessToken,
    token_secret: this.configSerivce.get<TwitterConfig>(TWITTER)
      .accessTokenSecret,
  }

  triggerChallenge() {
    const url =
      this.constants.webhooksEndpoint +
      "/" +
      this.configSerivce.get<TwitterConfig>(TWITTER).webhookId +
      ".json"
    console.log(url)
    const requestOptions = {
      url,
      oauth: this.oauth,
    }

    console.log("Triggering Twitter CRC")

    put(requestOptions, function (_, __, body) {
      console.log(body)
    })
  }

  registerWebhook() {
    const requestOptions = {
      url: this.constants.webhookRegistrationEndpoint,
      oauth: this.oauth,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      form: {
        url:
          this.configSerivce.get<GlobalConfig>(GLOBAL).origin +
          "/webhook/twitter",
      },
    }

    console.log("Creating a POST request")
    console.log(`to ${this.constants.webhookRegistrationEndpoint}`)
    console.log("for webhook registration")
    console.log(
      `of webhook url ${
        this.configSerivce.get<GlobalConfig>(GLOBAL).origin
      }/webhook/twitter
      `
    )

    post(requestOptions, function (_, __, body) {
      console.log(body)
    })
  }

  createChallengeResponse(crcToken: string) {
    const { apiKeySecret } = this.configSerivce.get<TwitterConfig>(TWITTER)
    const hmac = createHmac("sha256", apiKeySecret)
      .update(crcToken)
      .digest("base64")

    return `sha256=${hmac}`
  }

  storeWebhookId(webhookId: WebhookIdDto) {
    const path = join(__dirname, "id.json")
    writeFileSync(path, JSON.stringify(webhookId.toJSON()))
    const file = readFileSync(path)
    console.log("file: ", file)
  }
}
