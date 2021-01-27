import { Inject, Injectable, Logger } from "@nestjs/common"
import { EventEmitter2 } from "@nestjs/event-emitter"
import _ from "lodash"
import { ConstantsProvider } from "src/constants/constants.provider"
import { FollowersLimitEvent } from "src/events/limit/followers.limit"
import { InitialFollowersLimitEvent } from "src/events/limit/initialFollowers.limit"
import { LimitEvent } from "src/events/limit/limit.events"
import { UsersLimitEvent } from "src/events/limit/users.limit"
import { StatusCreateEvent } from "src/events/status/status.create"
import { StatusEvent } from "src/events/status/status.events"
import { StatusReplyEvent } from "src/events/status/status.reply"
import { UserJoinEvent } from "src/events/user/join.user"
import { UserJoinedEvent } from "src/events/user/joined.user"
import { UserLeaveEvent } from "src/events/user/leave.user"
import { UserRemoveEvent } from "src/events/user/remove.user"
import { UserEvent } from "src/events/user/user.events"
import { FollowLookupService } from "src/follow-lookup/follow-lookup.service"
import { TweetsService } from "src/tweets/tweets.service"
import { UserLookupService } from "src/user-lookup/user-lookup.service"
import { Repository } from "typeorm"
import { User } from "./user.entity"
import { USER_REPOSITORY } from "./user.providers"

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: Repository<User>,
    private readonly followerLookupService: FollowLookupService,
    private readonly userLookupService: UserLookupService,
    private eventEmitter: EventEmitter2,
    private tweetsService: TweetsService,
    private readonly constants: ConstantsProvider
  ) {}

  private readonly logger = new Logger(UserService.name)

  async join({
    userId,
    name,
    tweetId,
    followersCount,
  }: UserJoinEvent): Promise<void> {
    if (followersCount > this.constants.followersCountLimit) {
      this.eventEmitter.emit(
        LimitEvent.InitialFollowers,
        new InitialFollowersLimitEvent(name, tweetId)
      )
      return
    }

    if ((await this.countUsers()) === this.constants.usersCountLimit) {
      this.eventEmitter.emit(
        LimitEvent.Users,
        new UsersLimitEvent(name, tweetId)
      )
      return
    }

    this.logger.log(`Saving user ${name} in database`)

    try {
      const user = await this.userRepository.findOne(userId)

      if (user) {
        this.logger.log(`User ${name} already exists in database`)
        this.eventEmitter.emit(
          StatusEvent.Reply,
          new StatusReplyEvent(
            this.tweetsService.alreadyJoined(name),
            tweetId,
            name
          )
        )
        return null
      }

      const result = await this.userRepository.insert({ id: userId })

      if (result) {
        this.eventEmitter.emit(
          UserEvent.Joined,
          new UserJoinedEvent(userId, name)
        )

        this.eventEmitter.emit(
          StatusEvent.Reply,
          new StatusReplyEvent(this.tweetsService.joined(name), tweetId, name)
        )
      }

      return this.logger.log(`User ${name} saved in database`)
    } catch (_) {
      this.eventEmitter.emit(
        StatusEvent.Reply,
        new StatusReplyEvent(this.tweetsService.error(name), tweetId, name)
      )

      return this.logger.error(`Couldn't save user ${name}`)
    }
  }

  async leave({ userId, name, tweetId }: UserLeaveEvent): Promise<void> {
    this.logger.warn(`Removing user ${name} from database`)

    try {
      const user = await this.userRepository.findOne(userId)

      if (!user) {
        this.logger.log(`User ${name} doen't exist in database`)
        this.eventEmitter.emit(
          StatusEvent.Reply,
          new StatusReplyEvent(
            this.tweetsService.userDoesntExist(name),
            tweetId,
            name
          )
        )
        return null
      }

      await this.userRepository.delete({ id: userId })

      this.eventEmitter.emit(
        StatusEvent.Reply,
        new StatusReplyEvent(this.tweetsService.left(name), tweetId, name)
      )

      return this.logger.log(`Removed user ${name} from database`)
    } catch (_) {
      this.eventEmitter.emit(
        StatusEvent.Reply,
        new StatusReplyEvent(this.tweetsService.error(name), tweetId, name)
      )

      return this.logger.error(`Couldn't remove user ${name} from database`)
    }
  }

  async remove({ userId, name }: UserRemoveEvent): Promise<void> {
    this.logger.warn(`Removing user ${name} from database`)

    try {
      await this.userRepository.delete({ id: userId })

      return this.logger.log(`Removed user ${name} from database`)
    } catch (_) {
      return this.logger.error(`Couldn't remove user ${name} from database`)
    }
  }

  async saveInitialFollowers(userId: string) {
    const ids = await this.followerLookupService.fetchFollowers(userId)

    await this.saveFollowers(userId, ids)
  }

  async saveFollowers(userId: string, followerIds: Array<string>) {
    const followers = JSON.stringify(followerIds)

    await this.userRepository.update({ id: userId }, { followers })
  }

  async compareForAllUsers() {
    const users = await this.findAll()

    for (const i in users) {
      this.compareFollowers(users[i].id)
    }
  }

  private async compareFollowers(userId: string) {
    const user = await this.userLookupService.userShow(userId)

    this.logger.log(`Starting followers comparison for user ${user.name}`)

    if (!user) return

    if (user.followers_count > this.constants.followersCountLimit) {
      this.eventEmitter.emit(
        LimitEvent.Followers,
        new FollowersLimitEvent(userId, user.screen_name, user.name)
      )
      return
    }

    const oldFollowers: Array<string> = JSON.parse(
      (await this.findOne(userId)).followers
    )

    if (!oldFollowers || oldFollowers.length < 1) {
      this.logger.log(
        `User ${user.name} had 0 followers last day, trying to fetch new followers`
      )
    }

    const newFollowers = await this.followerLookupService.fetchFollowers(userId)

    if (newFollowers) {
      if (!_.isEqual(newFollowers, oldFollowers)) {
        await this.saveFollowers(userId, newFollowers)
      }

      const _unfollowers = _.difference(oldFollowers, newFollowers)

      if (_unfollowers.length < 1) {
        return this.eventEmitter.emit(
          StatusEvent.Tweet,
          new StatusCreateEvent(
            this.tweetsService.noUnfollowers(user.name, user.screen_name)
          )
        )
      }

      const unfollowers = await this.userLookupService.userLookup(_unfollowers)

      if (unfollowers.length < 5) {
        this.eventEmitter.emit(
          StatusEvent.Tweet,
          new StatusCreateEvent(
            this.tweetsService.fewUnfollowers(
              user.name,
              user.screen_name,
              unfollowers.map((unfollower) => unfollower.screen_name)
            )
          )
        )
      } else {
        this.eventEmitter.emit(
          StatusEvent.Tweet,
          new StatusCreateEvent(
            this.tweetsService.manyUnfollowers(
              user.name,
              user.screen_name,
              unfollowers.map((unfollower) => unfollower.screen_name)
            )
          )
        )
      }
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

    const user = await this.userRepository.findOne(id)

    if (user) {
      this.logger.log(`User ${id} found in database`)
      return user
    } else {
      this.logger.log(`User ${id} not found in database`)
      return null
    }
  }

  private async findAll(): Promise<User[]> {
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

  private countUsers() {
    const q = this.userRepository.createQueryBuilder("u")

    return q.getCount()
  }
}
