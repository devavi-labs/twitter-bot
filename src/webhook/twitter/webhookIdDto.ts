export class WebhookIdDto {
  constructor(public readonly id: string) {}

  static fromJSON(data: Record<string, string>) {
    return new WebhookIdDto(data["id"])
  }

  toJSON() {
    return {
      webhookId: this.id,
    }
  }
}
