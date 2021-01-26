import { Body, Controller, Get, Logger, Post, Query } from "@nestjs/common"
import { BotCommand } from "src/commands/commands.bot"
import { TwitterService } from "./twitter.service"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { UserEvent } from "src/events/user/user.events"
import { UserJoinEvent } from "src/events/user/user.join"
import { UserLeaveEvent } from "src/events/user/user.leave"

@Controller("webhook/twitter")
export class TwitterController {
  constructor(
    private readonly twitterService: TwitterService,
    private eventEmitter: EventEmitter2
  ) {
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

    this.logger.log("Returning response to Twitter")

    return response
  }

  @Post()
  handleEvents(@Body() data: Record<string, any>) {
    if (
      "tweet_create_events" in data &&
      !data["user_has_blocked"] &&
      data["tweet_create_events"][0]["user"]["id_str"] !== data["for_user_id"]
    ) {
      if (
        (data["tweet_create_events"][0]["text"] as string).startsWith(
          BotCommand.Join
        )
      ) {
        this.eventEmitter.emit(
          UserEvent.Join,
          new UserJoinEvent(
            data["tweet_create_events"][0]["user"]["id_str"],
            data["tweet_create_events"][0]["user"]["name"],
            data["tweet_create_events"][0]["id_str"]
          )
        )
      } else if (
        (data["tweet_create_events"][0]["text"] as string).startsWith(
          BotCommand.Leave
        )
      ) {
        this.eventEmitter.emit(
          UserEvent.Leave,
          new UserLeaveEvent(
            data["tweet_create_events"][0]["user"]["id_str"],
            data["tweet_create_events"][0]["user"]["name"],
            data["tweet_create_events"][0]["id_str"]
          )
        )
      }
    }
  }
}
