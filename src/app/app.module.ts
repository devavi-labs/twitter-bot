import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import globalConfig from "src/config/global.config"
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
