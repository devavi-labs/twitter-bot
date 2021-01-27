import { Module } from "@nestjs/common"
import { ConstantsModule } from "src/constants/constants.module"
import { FollowLookupModule } from "src/follow-lookup/follow-lookup.module"
import { OAuthModule } from "src/oAuth/oAuth.module"
import { TweetsModule } from "src/tweets/tweets.module"
import { UserLookupModule } from "src/user-lookup/user-lookup.module"
import { DatabaseModule } from "../database/database.module"
import { userProvider } from "./user.providers"
import { UserService } from "./user.service"

@Module({
  imports: [
    DatabaseModule,
    FollowLookupModule,
    UserLookupModule,
    TweetsModule,
    OAuthModule,
    ConstantsModule,
  ],
  providers: [...userProvider, UserService],
  exports: [...userProvider, UserService],
})
export class UserModule {}
