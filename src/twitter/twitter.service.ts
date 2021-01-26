import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { forEach } from "async-foreach"
import axios from "axios"
import axiosRateLimit from "axios-rate-limit"
import { createHmac } from "crypto"
import qs from "qs"
import { GLOBAL, GlobalConfig } from "src/config/global.config"
import { TWITTER, TwitterConfig } from "src/config/twitter.config"
import { Constants } from "src/constants"
import { OAuthService } from "src/oAuth/oAuth.service"
import { StatusService } from "src/status/status.service"
import { SubscriptionType } from "src/types/subscription.type"
import { WebhookType } from "src/types/webhook.type"

@Injectable()
export class TwitterService {
  constructor(
    private readonly configSerivce: ConfigService,
    private readonly statusService: StatusService,
    private readonly oAuthService: OAuthService,
    private readonly constants: Constants
  ) {}

  private readonly logger = new Logger(TwitterService.name)

  webhooks: Array<WebhookType> = []
  subscriptions: Array<SubscriptionType> = []

  async init() {
    await this.getAllWebhooks()

    if (this.webhooks.length > 0) {
      await forEach(this.webhooks, async (webhook: WebhookType) => {
        await this.removeWebhook(webhook.id)
      })
      this.webhooks = []
    }

    await this.registerWebhook()
    await this.registerSubscription()
    await this.getAllSubscriptions()

    //eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    setInterval(() => self.triggerChallenge(self), 1000 * 60 * 25)
  }

  private http = axiosRateLimit(axios.create(), {
    maxRequests: 900,
    perMilliseconds: 1000 * 60 * 15, // 15 minutes
  })

  private async getAllWebhooks() {
    const url = `${this.constants.envEndpoint}/webhooks.json`

    this.logger.log("Checking for existing webhooks")

    try {
      const { data } = (await this.http.get(url, {
        headers: {
          Authorization: this.oAuthService.oAuth02aHeader,
        },
      })) as { data: Array<WebhookType> }

      if (data && data.length > 0) {
        this.logger.log(
          `Following webhooks found: ${data.map((wh) => wh.id).join(", ")}`
        )

        this.webhooks.push(...data)
      } else {
        this.logger.log("No webhook found.")
      }
    } catch (err) {
      this.logger.error("Couldn't connect because: ", err.response.data)
    }
  }

  private async getAllSubscriptions() {
    const url = `${this.constants.envEndpoint}/subscriptions/list.json`

    this.logger.log("Checking for existing subscriptions.")

    try {
      const { data } = (await this.http.get(url, {
        headers: {
          Authorization: this.oAuthService.oAuth02aHeader,
        },
      })) as { data: { subscriptions: Array<SubscriptionType> } }

      if (data && data.subscriptions.length > 0) {
        this.logger.log(
          `Following subscriptions found: ${data.subscriptions
            .map((s) => s.user_id)
            .join(", ")}`
        )

        this.subscriptions.push(...data.subscriptions)
      } else {
        this.logger.log("No subscriptions found.")
      }
    } catch (err) {
      this.logger.error("Couldn't connect because: ", err.response.data)
    }
  }

  private triggerChallenge(self: this) {
    if (self.webhooks.length < 1) {
      this.logger.log("No webhook registered yet.")
      return
    }

    const url = `${self.constants.envEndpoint}/webhooks/${self.webhooks[0].id}.json`

    self.logger.log("Triggering Twitter CRC")

    this.http
      .put(url, null, {
        headers: {
          Authorization: self.oAuthService.oAuth01aHeader(url, "PUT"),
        },
      })
      .catch((err) =>
        this.logger.error("Couldn't connect because: ", err.response.data)
      )
  }

  private async registerWebhook() {
    const webhookUrl = `${
      this.configSerivce.get<GlobalConfig>(GLOBAL).origin
    }/webhook/twitter`

    const url = `${this.constants.envEndpoint}/webhooks.json`

    this.logger.log(
      `Creating a POST request to ${url} for webhook registration of webhook url ${webhookUrl}`
    )

    const params = {
      url: webhookUrl,
    }

    try {
      const { data } = (await this.http.post(url, qs.stringify(params), {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: this.oAuthService.oAuth01aHeader(url, "POST", params),
        },
      })) as { data: WebhookType }

      this.logger.log(`Webhook registered as ${data.id}`)
      this.webhooks.push(data)
    } catch (err) {
      this.logger.error(err)
    }
  }

  private async removeWebhook(webhookId: string) {
    const url = `${this.constants.envEndpoint}/webhooks/${webhookId}.json`

    this.logger.warn(`Removing the webhook ${webhookId}`)

    try {
      await this.http.delete(url, {
        headers: {
          Authorization: this.oAuthService.oAuth01aHeader(url, "DELETE"),
        },
      })
      this.logger.log(`Webhook ${webhookId} removed`)
    } catch (err) {
      this.logger.error(err)
    }
  }

  private async registerSubscription() {
    if (this.webhooks.length < 1) {
      this.logger.log("No webhook registered yet.")
      return
    }

    const url = `${this.constants.envEndpoint}/subscriptions.json`

    this.logger.log(
      `Creating a POST request to ${url} for subscriptions registration.`
    )

    try {
      await this.http.post(url, null, {
        headers: {
          Authorization: this.oAuthService.oAuth01aHeader(url, "POST"),
        },
      })

      this.logger.log("Subscription registered.")
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

  listenToEvent(data: Record<string, any>) {
    if (
      "tweet_create_events" in data &&
      !data["user_has_blocked"] &&
      data["tweet_create_events"][0]["user"]["id_str"] !== data["for_user_id"]
    ) {
      this.statusService.update(
        `you too ${data["tweet_create_events"][0]["text"]}`,
        data["tweet_create_events"][0]["id_str"]
      )
    }
  }
}
