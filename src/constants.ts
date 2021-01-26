export class Constants {
  envName = "prod"

  rootEndpoint = "https://api.twitter.com/1.1"
  accountActivityEndpoint = `${this.rootEndpoint}/account_activity`
  envEndpoint = `${this.accountActivityEndpoint}/all/${this.envName}`
  statusEndpoint = `${this.rootEndpoint}/statuses`
  statusUpdateEndpoint = `${this.statusEndpoint}/update.json`
}
