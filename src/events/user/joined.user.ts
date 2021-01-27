export class UserJoinedEvent {
  constructor(public readonly userId: string, public readonly name: string) {}
}
