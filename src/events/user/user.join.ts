export class UserJoinEvent {
  userId: number

  constructor(userId: string, public readonly name: string) {
    this.userId = parseInt(userId)
  }
}
