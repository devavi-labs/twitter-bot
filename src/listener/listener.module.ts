import { Module } from "@nestjs/common"
import { StatusModule } from "src/status/status.module"
import { TaskModule } from "src/task/task.module"
import { TweetsModule } from "src/tweets/tweets.module"
import { TwitterModule } from "src/twitter/twitter.module"
import { UserModule } from "src/user/user.module"
import { ListenerService } from "./listener.service"

@Module({
  imports: [UserModule, TaskModule, TwitterModule, StatusModule, TweetsModule],
  providers: [ListenerService],
})
export class ListenerModule {}
