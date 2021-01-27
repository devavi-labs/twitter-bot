export class UserLeaveEvent {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly tweetId: string
  ) {}
}
