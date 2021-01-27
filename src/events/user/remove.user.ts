export class UserRemoveEvent {
  constructor(public readonly userId: string, public readonly name: string) {}
}
