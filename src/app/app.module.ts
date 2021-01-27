import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { ScheduleModule } from "@nestjs/schedule"
import databaseConfig from "src/config/database.config"
import { eventEmitterConfig } from "src/config/eventEmitter.config"
import globalConfig from "src/config/global.config"
import { ConstantsModule } from "src/constants/constants.module"
import { FollowLookupModule } from "src/follow-lookup/follow-lookup.module"
import { ListenerModule } from "src/listener/listener.module"
import { OAuthModule } from "src/oAuth/oAuth.module"
import { StatusModule } from "src/status/status.module"
import { TaskModule } from "src/task/task.module"
import { TweetsModule } from "src/tweets/tweets.module"
import { TwitterModule } from "src/twitter/twitter.module"
import { UserLookupModule } from "src/user-lookup/user-lookup.module"
import { UserModule } from "src/user/user.module"
import twitterConfig from "../config/twitter.config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [twitterConfig, globalConfig, databaseConfig],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(eventEmitterConfig),
    TwitterModule,
    StatusModule,
    OAuthModule,
    UserModule,
    ListenerModule,
    ScheduleModule.forRoot(),
    TaskModule,
    UserLookupModule,
    FollowLookupModule,
    TweetsModule,
    ConstantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
