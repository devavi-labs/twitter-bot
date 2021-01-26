import { Module } from "@nestjs/common"
import { Constants } from "src/constants"
import { OAuthService } from "src/oAuth/oAuth.service"
import { TwitterController } from "./twitter.controller"
import { TwitterService } from "./twitter.service"

@Module({
  controllers: [TwitterController],
  providers: [TwitterService, Constants, OAuthService],
})
export class TwitterModule {}
