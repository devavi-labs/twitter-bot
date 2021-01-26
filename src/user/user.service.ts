import { Inject, Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { UserEvent } from "src/events/user/user.events"
import { UserJoinEvent } from "src/events/user/user.join"
import { UserLeaveEvent } from "src/events/user/user.leave"
import { Repository } from "typeorm"
import { User } from "./user.entity"
import { USER_REPOSITORY } from "./user.providers"

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>
  ) {}

  private readonly logger = new Logger(UserService.name)

  @OnEvent(UserEvent.Join)
  async save({ userId, name }: UserJoinEvent): Promise<void> {
    this.logger.log(`Saving user ${name} in database`)

    try {
      const user = await this.userRepository.findOne(userId)

      if (user) {
        this.logger.log(`User ${name} already exists in database`)
        return null
      }

      await this.userRepository.insert({ id: userId })

      return this.logger.log(`User ${name} saved in database`)
    } catch (_) {
      return this.logger.error(`Couldn't save user ${name}`)
    }
  }

  @OnEvent(UserEvent.Leave)
  async removeOne({ userId, name }: UserLeaveEvent): Promise<void> {
    this.logger.warn(`Removing user ${name} from database`)

    try {
      const user = await this.userRepository.findOne(userId)

      if (!user) {
        this.logger.log(`User ${name} doen't exist in database`)
        return null
      }

      await this.userRepository.delete({ id: userId })

      return this.logger.log(`Removed user ${name} from database`)
    } catch (_) {
      return this.logger.error(`Couldn't remove user ${name} from database`)
    }
  }

  async removeAll(): Promise<boolean> {
    this.logger.warn("Removing all users from database")
    try {
      await this.userRepository.clear()
      this.logger.log("Removed all users from database")

      return true
    } catch (_) {
      this.logger.log("Couldn't remove all users from database")

      return false
    }
  }

  async findOne(id: string): Promise<User> {
    this.logger.log(`Looking for user ${id} in database`)
    const _id = parseInt(id)

    const user = await this.userRepository.findOne(_id)

    if (user) {
      this.logger.log(`User ${id} found in database`)
      return user
    } else {
      this.logger.log(`User ${id} not found in database`)
      return null
    }
  }

  async findAll(): Promise<User[]> {
    this.logger.log("Fetching all users from database")

    const users = await this.userRepository.find()

    if (users && users.length > 0) {
      this.logger.log("Users fetched from database")
      return users
    } else {
      this.logger.log("No user saved in database")
      return null
    }
  }
}
