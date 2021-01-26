export class StatusReplyEvent {
  constructor(
    public readonly text: string,
    public readonly inReplyToTweetId: string,
    public readonly user: string
  ) {}
}
