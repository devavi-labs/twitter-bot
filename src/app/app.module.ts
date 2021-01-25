import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import globalConfig from "src/config/global.config"
import { WebhookModule } from "src/webhook/webhook.module"
import twitterConfig from "../config/twitter.config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [twitterConfig, globalConfig],
      isGlobal: true,
    }),
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
