import { Module } from "@nestjs/common"
import { ConstantsModule } from "src/constants/constants.module"
import { OAuthModule } from "src/oAuth/oAuth.module"
import { TwitterController } from "./twitter.controller"
import { TwitterService } from "./twitter.service"

@Module({
  imports: [OAuthModule, ConstantsModule],
  controllers: [TwitterController],
  providers: [TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}
