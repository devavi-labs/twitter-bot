import { ConfigService } from "@nestjs/config"
import { DATABASE, DatabaseConfig } from "src/config/database.config"
import { createConnection } from "typeorm"
import { DatabaseLogger } from "./database.logger"

export const DATABASE_CONNECTION = "DATABASE_CONNECTION"

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (config: ConfigService, logger: DatabaseLogger) =>
      await createConnection({
        type: config.get<DatabaseConfig>(DATABASE).type,
        url: config.get<DatabaseConfig>(DATABASE).url,
        username: config.get<DatabaseConfig>(DATABASE).username,
        password: config.get<DatabaseConfig>(DATABASE).password,
        database: config.get<DatabaseConfig>(DATABASE).name,
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: true,
        logging: true,
        logger,
      }),
    inject: [ConfigService, DatabaseLogger],
  },
]
