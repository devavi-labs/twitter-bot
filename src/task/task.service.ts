import { Injectable, Logger } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import { Cron, CronExpression } from "@nestjs/schedule"
import { TaskEvent } from "src/events/task/task.events"

@Injectable()
export class TaskService {
  constructor(private readonly eventEmitter: EventEmitter2) {
    this.init()
  }

  private readonly logger = new Logger(TaskService.name)

  private init() {
    this.logger.log("Emitting init tast")
    this.eventEmitter.emit(TaskEvent.Init)
  }

  @Cron("*/25 * * * *")
  routineCRC() {
    this.logger.log("Emitting routine CRC task")
    this.eventEmitter.emit(TaskEvent.RoutineCRC)
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  compareFollowers() {
    this.logger.log("Emitting followers comparision task")
    this.eventEmitter.emit(TaskEvent.FollowersCompare)
  }
}
