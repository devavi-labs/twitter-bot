export class UserJoinEvent {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly tweetId: string,
    public readonly followersCount: number
  ) {}
}
