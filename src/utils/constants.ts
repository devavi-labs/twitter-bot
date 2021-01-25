export class Constants {
  apiEndpoint = "https://api.twitter.com/1.1"
  accountActivityEndpoint = this.apiEndpoint + "/account_activity/all/prod"
  webhookRegistrationEndpoint = this.accountActivityEndpoint + "/webhooks.json"
}
