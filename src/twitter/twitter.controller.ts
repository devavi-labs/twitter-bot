import { Body, Controller, Get, Logger, Post, Query } from "@nestjs/common"
import { WebhookType } from "src/types/webhook.type"
import { TwitterService } from "./twitter.service"

@Controller("webhook/twitter")
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {
    this.twitterService.init()
  }

  private readonly logger = new Logger(TwitterController.name)

  @Get()
  handleChallenge(@Query("crc_token") crcToken: string) {
    this.logger.log("Twitter sent a CRC")

    const responseToken = this.twitterService.createChallengeResponse(crcToken)

    const response = {
      response_token: responseToken,
    }

    this.logger.log("Returning following response to Twitter:")
    this.logger.log(response)

    return response
  }

  @Post()
  webhookRegisterResponse(@Body() webhook: WebhookType) {
    this.logger.log(`Webhook registered with id ${webhook.id}`)
  }
}
