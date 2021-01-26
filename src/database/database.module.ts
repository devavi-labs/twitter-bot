import { Module } from "@nestjs/common"
import { DatabaseLogger } from "./database.logger"
import { databaseProviders } from "./database.providers"

@Module({
  providers: [...databaseProviders, DatabaseLogger],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
