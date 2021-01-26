import { Module } from "@nestjs/common"
import { Constants } from "src/constants"
import { OAuthService } from "src/oAuth/oAuth.service"
import { StatusService } from "./status.service"

@Module({
  providers: [StatusService, Constants, OAuthService],
})
export class StatusModule {}
