export class Constants {
  apiEndpoint = "https://api.twitter.com/1.1"
  accountActivityEndpoint = this.apiEndpoint + "/account_activity/all/prod"
  webhooksEndpoint = this.accountActivityEndpoint + "/webhooks"
  webhookRegistrationEndpoint = this.webhooksEndpoint + ".json"
}
