import { Injectable } from "@nestjs/common"

@Injectable()
export class ConstantsProvider {
  private readonly envName = "prod"
  private readonly rootEndpoint = "https://api.twitter.com/1.1"

  readonly accountActivityEndpoint = `${this.rootEndpoint}/account_activity`
  readonly envEndpoint = `${this.accountActivityEndpoint}/all/${this.envName}`
  readonly statusEndpoint = `${this.rootEndpoint}/statuses`
  readonly statusUpdateEndpoint = `${this.statusEndpoint}/update.json`

  readonly followersEndpoint = `${this.rootEndpoint}/followers/ids.json`
  readonly usersLookupEndpoint = `${this.rootEndpoint}/users/lookup.json`
  readonly usersShowEndpoint = `${this.rootEndpoint}/users/show.json`

  readonly usersCountLimit = 50
  readonly followersCountLimit = 2500
}
