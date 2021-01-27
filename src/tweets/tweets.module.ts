import { Module } from "@nestjs/common"
import { ConstantsModule } from "src/constants/constants.module"
import { TweetsService } from "./tweets.service"

@Module({
  imports: [ConstantsModule],
  providers: [TweetsService],
  exports: [TweetsService],
})
export class TweetsModule {}
