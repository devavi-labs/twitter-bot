import { Module } from "@nestjs/common"
import { ConstantsModule } from "src/constants/constants.module"
import { OAuthModule } from "src/oAuth/oAuth.module"
import { FollowLookupService } from "./follow-lookup.service"

@Module({
  imports: [OAuthModule, ConstantsModule],
  providers: [FollowLookupService],
  exports: [FollowLookupService],
})
export class FollowLookupModule {}
