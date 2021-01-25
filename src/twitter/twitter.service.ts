import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createHmac } from "crypto"
import { GLOBAL, GlobalConfig } from "src/config/global.config"
import { TWITTER, TwitterConfig } from "src/config/twitter.config"
import { Constants } from "src/constants"
import { SubscriptionType } from "src/types/subscription.type"
import { WebhookType } from "src/types/webhook.type"
import { promiseRequest } from "src/utils/promiseRequest"

@Injectable()
export class TwitterService {
  constructor(
    private readonly configSerivce: ConfigService,
    private readonly constants: Constants
  ) {}

  private readonly logger = new Logger(TwitterService.name)

  webhooks: Array<WebhookType> = []
  subscriptions: Array<SubscriptionType> = []

  private readonly oauth = {
    consumer_key: this.configSerivce.get<TwitterConfig>(TWITTER).apiKey,
    consumer_secret: this.configSerivce.get<TwitterConfig>(TWITTER)
      .apiKeySecret,
    token: this.configSerivce.get<TwitterConfig>(TWITTER).accessToken,
    token_secret: this.configSerivce.get<TwitterConfig>(TWITTER)
      .accessTokenSecret,
  }

  async init() {
    await this.getAllWebhooks()

    if (this.webhooks.length === 0) {
      await this.registerWebhook()
    } else {
      await this.getAllSubscriptions()

      if (this.subscriptions.length === 0) {
        await this.registerSubscription()
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    setInterval(() => self.triggerChallenge(self), 1000 * 60 * 25)
  }

  private async getAllWebhooks() {
    const url = `${this.constants.accountActivityEndpoint}/webhooks.json`

    const requestOptions = {
      method: "GET",
      url,
      headers: {
        Authorization: `Bearer ${
          this.configSerivce.get<TwitterConfig>(TWITTER).bearerToken
        }`,
      },
    }

    this.logger.log("Checking for existing webhooks")

    try {
      const data = await promiseRequest(requestOptions)
      const json = JSON.parse(data) as Array<WebhookType>

      if (json && json.length > 0) {
        this.logger.log(
          `Following webhooks found: ${json.map((wh) => wh.id).join(", ")}`
        )

        this.webhooks.push(...json)
      } else {
        this.logger.log("No webhook found.")
      }
    } catch (err) {
      this.logger.error("Couldn't connect because: ", err)
    }
  }

  private async getAllSubscriptions() {
    const url = `${this.constants.accountActivityEndpoint}/subscriptions/list.json`

    const requestOptions = {
      method: "GET",
      url,
      headers: {
        Authorization: `Bearer ${
          this.configSerivce.get<TwitterConfig>(TWITTER).bearerToken
        }`,
      },
    }

    this.logger.log("Checking for existing subscriptions.")

    try {
      const data = await promiseRequest(requestOptions)
      const json = JSON.parse(data) as {
        subscriptions: Array<SubscriptionType>
      }

      if (json && json.subscriptions.length > 0) {
        this.logger.log(
          `Following subscriptions found: ${json.subscriptions
            .map((s) => s.user_id)
            .join(", ")}`
        )

        this.subscriptions.push(...json.subscriptions)
      } else {
        this.logger.log("No subscriptions found.")
      }
    } catch (err) {
      this.logger.error("Couldn't connect because: ", err)
    }
  }

  private triggerChallenge(self: this) {
    const url = `${self.constants.accountActivityEndpoint}/webhooks/${
      self.configSerivce.get<TwitterConfig>(TWITTER).webhookId
    }.json`

    const requestOptions = { method: "POST", url, oauth: self.oauth }

    self.logger.log("Triggering Twitter CRC")

    promiseRequest(requestOptions)
  }

  private async registerWebhook() {
    const webhookUrl = `${
      this.configSerivce.get<GlobalConfig>(GLOBAL).origin
    }/webhook/twitter`

    const url = `${this.constants.accountActivityEndpoint}/webhooks.json`

    const requestOptions = {
      method: "POST",
      url,
      oauth: this.oauth,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      form: { url: webhookUrl },
    }

    this.logger.log(`
      Creating a POST request to ${url}
      for webhook registration of webhook url ${webhookUrl}
    `)

    try {
      const data = await promiseRequest(requestOptions)
      this.logger.log(data)
    } catch (err) {
      this.logger.error(err)
    }
  }

  private async registerSubscription() {
    const url = `${this.constants.accountActivityEndpoint}/subscriptions.json`

    const requestOptions = {
      method: "POST",
      url,
      oauth: this.oauth,
    }

    this.logger.log(`
      Creating a POST request to ${url}
      for subscriptions registration.
    `)

    try {
      const data = await promiseRequest(requestOptions)
      this.logger.log(data)
    } catch (err) {
      this.logger.error(err)
    }
  }

  createChallengeResponse(crcToken: string) {
    const { apiKeySecret } = this.configSerivce.get<TwitterConfig>(TWITTER)

    this.logger.log("Creating the required hash")

    const hmac = createHmac("sha256", apiKeySecret)
      .update(crcToken)
      .digest("base64")

    this.logger.log("Hash created")

    return `sha256=${hmac}`
  }
}
