import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { EventEmitterModule } from "@nestjs/event-emitter"
import databaseConfig from "src/config/database.config"
import { eventEmitterConfig } from "src/config/eventEmitter.config"
import globalConfig from "src/config/global.config"
import { ListenerModule } from "src/listener/listener.module"
import { OAuthModule } from "src/oAuth/oAuth.module"
import { OAuthService } from "src/oAuth/oAuth.service"
import { StatusModule } from "src/status/status.module"
import { TwitterModule } from "src/twitter/twitter.module"
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
  ],
  controllers: [AppController],
  providers: [AppService, OAuthService],
})
export class AppModule {}
