import { Module } from "@nestjs/common"
import { ConstantsProvider } from "./constants.provider"

@Module({
  providers: [ConstantsProvider],
  exports: [ConstantsProvider],
})
export class ConstantsModule {}
