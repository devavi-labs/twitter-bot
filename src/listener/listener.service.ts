import { Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { FollowersLimitEvent } from "src/events/limit/followers.limit"
import { InitialFollowersLimitEvent } from "src/events/limit/initialFollowers.limit"
import { LimitEvent } from "src/events/limit/limit.events"
import { UsersLimitEvent } from "src/events/limit/users.limit"
import { StatusCreateEvent } from "src/events/status/status.create"
import { StatusEvent } from "src/events/status/status.events"
import { StatusReplyEvent } from "src/events/status/status.reply"
import { TaskEvent } from "src/events/task/task.events"
import { UserJoinEvent } from "src/events/user/join.user"
import { UserJoinedEvent } from "src/events/user/joined.user"
import { UserLeaveEvent } from "src/events/user/leave.user"
import { UserRemoveEvent } from "src/events/user/remove.user"
import { UserEvent } from "src/events/user/user.events"
import { StatusService } from "src/status/status.service"
import { TweetsService } from "src/tweets/tweets.service"
import { TwitterService } from "src/twitter/twitter.service"
import { UserService } from "src/user/user.service"

@Injectable()
export class ListenerService {
  constructor(
    private readonly userService: UserService,
    private readonly statusService: StatusService,
    private readonly twitterService: TwitterService,
    private readonly tweetsService: TweetsService
  ) {
    this.userService.compareForAllUsers()
  }

  private readonly logger = new Logger(ListenerService.name)

  @OnEvent(TaskEvent.Init)
  onInit() {
    this.logger.log(`Init event triggered`)
    this.twitterService.init()
  }

  @OnEvent(TaskEvent.RoutineCRC)
  onRoutineCRC() {
    this.logger.log(`Routine CRC event triggered`)
    this.twitterService.triggerChallenge()
  }

  @OnEvent(TaskEvent.FollowersCompare)
  onFollowerCompare() {
    this.logger.log(`Follower compare event triggered`)
    this.userService.compareForAllUsers()
  }

  @OnEvent(UserEvent.Join)
  onUserJoin({ userId, name, tweetId, followersCount }: UserJoinEvent) {
    this.logger.log(`Join event triggered for user ${name}`)
    this.userService.join({ userId, name, tweetId, followersCount })
  }

  @OnEvent(UserEvent.Joined)
  onUserJoined({ name, userId }: UserJoinedEvent) {
    this.logger.log(`Joined event triggered for user ${name}`)
    this.userService.saveInitialFollowers(userId)
  }

  @OnEvent(UserEvent.Leave)
  onUserLeave({ name, tweetId, userId }: UserLeaveEvent) {
    this.logger.log(`Leave event triggered for user ${name}`)
    this.userService.leave({ userId, name, tweetId })
  }

  @OnEvent(UserEvent.Remove)
  onUserRemove({ name, userId }: UserRemoveEvent) {
    this.logger.log(`Remove event triggered for user ${name}`)
    this.userService.remove({ userId, name })
  }

  @OnEvent(StatusEvent.Tweet)
  onTweet({ text }: StatusCreateEvent) {
    this.logger.log(`Tweet event triggered`)
    this.statusService.create(text)
  }

  @OnEvent(StatusEvent.Reply)
  onReply({ text, inReplyToTweetId, user }: StatusReplyEvent) {
    this.logger.log(`Reply event triggered`)
    this.statusService.reply(text, user, inReplyToTweetId)
  }

  @OnEvent(LimitEvent.Users)
  async onUsersLimit({ name, tweetId }: UsersLimitEvent) {
    this.logger.log(`User limit event triggered`)
    this.statusService.reply(this.tweetsService.usersLimit(name), name, tweetId)
  }

  @OnEvent(LimitEvent.InitialFollowers)
  onInitialFollowersLimit({ name, tweetId }: InitialFollowersLimitEvent) {
    this.logger.log(`Initial followers limit event triggered`)
    this.statusService.reply(
      this.tweetsService.initialFollowersLimit(name),
      name,
      tweetId
    )
  }

  @OnEvent(LimitEvent.Followers)
  async onFollowersLimit({ name, userId, username }: FollowersLimitEvent) {
    this.logger.log(`Initial followers limit event triggered`)
    await this.userService.remove({ userId, name })
    this.statusService.create(this.tweetsService.followersLimit(name, username))
  }
}
