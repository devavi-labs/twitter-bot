import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import globalConfig from "src/config/global.config"
import { OAuthModule } from "src/oAuth/oAuth.module"
import { OAuthService } from "src/oAuth/oAuth.service"
import { StatusModule } from "src/status/status.module"
import { TwitterModule } from "src/twitter/twitter.module"
import twitterConfig from "../config/twitter.config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [twitterConfig, globalConfig],
      isGlobal: true,
    }),
    TwitterModule,
    StatusModule,
    OAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, OAuthService],
})
export class AppModule {}
