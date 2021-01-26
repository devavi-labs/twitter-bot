import { DATABASE_CONNECTION } from "src/database/database.providers"
import { Connection } from "typeorm"
import { User } from "./user.entity"

export const USER_REPOSITORY = "USER_REPOSITORY"

export const userProvider = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: [DATABASE_CONNECTION],
  },
]
