export class Constants {
  envName = "prod"

  rootApiEndpoint = "https://api.twitter.com/1.1"
  accountActivityEndpoint = `${this.rootApiEndpoint}/account_activity/all/${this.envName}`
}
