import { Module } from "@nestjs/common"
import { ConstantsModule } from "src/constants/constants.module"
import { OAuthModule } from "src/oAuth/oAuth.module"
import { UserLookupService } from "./user-lookup.service"

@Module({
  imports: [OAuthModule, ConstantsModule],
  providers: [UserLookupService],
  exports: [UserLookupService],
})
export class UserLookupModule {}
