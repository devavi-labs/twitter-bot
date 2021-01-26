import { Module } from "@nestjs/common"
import { OAuthService } from "./oAuth.service"

@Module({
  providers: [OAuthService],
})
export class OAuthModule {}
