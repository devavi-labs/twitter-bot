import { Injectable, Logger } from "@nestjs/common"
import axios from "axios"
import axiosRateLimit from "axios-rate-limit"
import qs from "qs"
import { ConstantsProvider } from "src/constants/constants.provider"
import { OAuthService } from "src/oAuth/oAuth.service"
import { FollowerIdsObject } from "src/objects/followerIds.object"
import { FollowerParams } from "src/types/followerParams.type"

@Injectable()
export class FollowLookupService {
  constructor(
    private readonly constants: ConstantsProvider,
    private readonly oAuthService: OAuthService
  ) {}

  private readonly logger = new Logger(FollowLookupService.name)

  private http = axiosRateLimit(axios.create(), {
    maxRequests: 1,
    perMilliseconds: 1000 * 60, // 1 minute
  })

  async fetchFollowers(userId: string | number): Promise<Array<string>> {
    const ids: Array<string> = []

    const params: FollowerParams = {
      user_id: userId,
      stringify_ids: true,
    }

    const url = `${this.constants.followersEndpoint}?${qs.stringify(params)}`

    try {
      this.logger.log(`Fetching followers of user ${userId}`)

      const { data } = await this.http.get<FollowerIdsObject>(url, {
        headers: {
          Authorization: this.oAuthService.oAuth01aHeader(url, "GET"),
        },
      })

      this.logger.log(`Fetched followers of user ${userId}`)

      ids.push(...data.ids)
      return ids
    } catch (err) {
      this.logger.error(
        `Couldn't fetch followers of user ${userId} because ${err.reponse.data.message}`
      )

      return []
    }
  }
}
