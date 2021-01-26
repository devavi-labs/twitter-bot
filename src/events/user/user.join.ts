export class UserJoinEvent {
  userId: number

  constructor(
    userId: string,
    public readonly name: string,
    public readonly tweetId: string
  ) {
    this.userId = parseInt(userId)
  }
}
