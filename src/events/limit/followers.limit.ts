export class FollowersLimitEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly name: string
  ) {}
}
