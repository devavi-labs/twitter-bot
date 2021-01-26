import { Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { UserEvent } from "src/events/user/user.events"
import { UserJoinEvent } from "src/events/user/user.join"
import { UserLeaveEvent } from "src/events/user/user.leave"

@Injectable()
export class ListenerService {
  private readonly logger = new Logger(ListenerService.name)

  @OnEvent(UserEvent.Join)
  onUserJoinEvent({ name }: UserJoinEvent) {
    this.logger.log(`Join event triggered for user ${name}`)
  }

  @OnEvent(UserEvent.Leave)
  onUserLeaveEvent({ name }: UserLeaveEvent) {
    this.logger.log(`Leave event triggered for user ${name}`)
  }
}
