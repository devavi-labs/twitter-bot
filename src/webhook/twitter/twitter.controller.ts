import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { TwitterService } from "./twitter.service"
import { WebhookIdDto } from "./webhookIdDto"

@Controller("webhook/twitter")
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get()
  handleChallenge(@Query("crc_token") crcToken: string) {
    const responseToken = this.twitterService.createChallengeResponse(crcToken)

    return {
      response_token: responseToken,
    }
  }

  @Post()
  storeWebhookID(@Body() data: Record<string, string>) {
    const webhookIdDto = WebhookIdDto.fromJSON(data)
    return this.twitterService.storeWebhookId(webhookIdDto)
  }
}
