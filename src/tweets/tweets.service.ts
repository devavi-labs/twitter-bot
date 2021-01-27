import { Injectable } from "@nestjs/common"
import { nanoid } from "nanoid"
import { ConstantsProvider } from "src/constants/constants.provider"
import { alreadyJoinedTweet } from "./alreadyJoined.tweet"
import { errorTweet } from "./error.tweet"
import { fewUnfollowersTweet } from "./fewUnfollowers.tweet"
import { followersLimitTweet } from "./followersLimit.tweet"
import { initialFollowersLimitTweet } from "./initialFollowersLimit.tweet"
import { joinedTweet } from "./joined.tweet"
import { leftTweet } from "./left.tweet"
import { manyUnfollowersTweet } from "./manyUnfollowers.tweet"
import { noUnfollowersTweet } from "./noUnfollowers.tweet"
import { userDoesntExistTweet } from "./userDoesntExist.tweet"
import { usersLimitTweet } from "./usersLimit.tweet"

@Injectable()
export class TweetsService {
  constructor(private readonly constants: ConstantsProvider) {}

  private get id() {
    return nanoid(4)
  }

  private tweetWithId = (tweet: string) => `${this.id} ${tweet}`

  joined = (name: string) => this.tweetWithId(joinedTweet(name))

  alreadyJoined = (name: string) => this.tweetWithId(alreadyJoinedTweet(name))

  left = (name: string) => this.tweetWithId(leftTweet(name))

  userDoesntExist = (name: string) =>
    this.tweetWithId(userDoesntExistTweet(name))

  error = (name: string) => this.tweetWithId(errorTweet(name))

  initialFollowersLimit = (name: string) =>
    this.tweetWithId(
      initialFollowersLimitTweet(name, this.constants.followersCountLimit)
    )

  followersLimit = (name: string, username: string) =>
    this.tweetWithId(
      followersLimitTweet(name, username, this.constants.followersCountLimit)
    )

  usersLimit = (name: string) => this.tweetWithId(usersLimitTweet(name))

  noUnfollowers = (name: string, username: string) =>
    this.tweetWithId(noUnfollowersTweet(name, username))

  fewUnfollowers = (
    name: string,
    username: string,
    unfollowersUsername: Array<string>
  ) =>
    this.tweetWithId(fewUnfollowersTweet(name, username, unfollowersUsername))

  manyUnfollowers = (
    name: string,
    username: string,
    unfollowersUsername: Array<string>
  ) =>
    this.tweetWithId(manyUnfollowersTweet(name, username, unfollowersUsername))
}
