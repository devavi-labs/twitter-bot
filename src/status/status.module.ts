import { Module } from "@nestjs/common"
import { ConstantsModule } from "src/constants/constants.module"
import { OAuthModule } from "src/oAuth/oAuth.module"
import { StatusService } from "./status.service"

@Module({
  imports: [OAuthModule, ConstantsModule],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}
