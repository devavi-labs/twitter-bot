import { Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module"
import { userProvider } from "./user.providers"
import { UserService } from "./user.service"

@Module({
  imports: [DatabaseModule],
  providers: [...userProvider, UserService],
})
export class UserModule {}
