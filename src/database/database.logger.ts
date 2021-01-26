import { Injectable, Logger as NextLogger } from "@nestjs/common"
import { Logger as TypeORMLogger } from "typeorm"

@Injectable()
export class DatabaseLogger extends NextLogger implements TypeORMLogger {
  constructor() {
    super()
    super.setContext("Database")
  }

  logQuery(query: string, parameters?: any[]) {
    super.log(
      `[Query]: ${query}${
        parameters ? `\n[Parameters]: [${parameters.join(", ")}]` : ""
      }`
    )
  }
  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    super.error(
      `[Query Error]: ${query}\n[Error]: ${error.toString()}${
        parameters ? `\n[Parameters]: [${parameters.join(", ")}]` : ""
      }`
    )
  }
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    super.log(
      `[Query]: ${query}${
        parameters ? `\n[Parameters]: [${parameters.join(", ")}]` : ""
      }\t+${time}ms`
    )
  }
  logSchemaBuild(message: string) {
    super.log(`[Schema Build]: ${message}`)
  }
  logMigration(message: string) {
    super.log(`[Migration]: ${message}`)
  }
}
