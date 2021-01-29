import { Injectable, Logger } from "@nestjs/common"
import axios from "axios"
import axiosRateLimit from "axios-rate-limit"
import { ConstantsProvider } from "src/constants/constants.provider"
import { OAuthService } from "src/oAuth/oAuth.service"
import { UserObject } from "src/objects/user.object"

@Injectable()
export class UserLookupService {
  constructor(
    private readonly oAuthService: OAuthService,
    private readonly constants: ConstantsProvider
  ) {}
  private readonly logger = new Logger(UserLookupService.name)

  private http = axiosRateLimit(axios.create(), {
    maxRequests: 20,
    perMilliseconds: 1000 * 60, // 1 minute
  })

  async userLookup(
    userIds: Array<string | number>
  ): Promise<Array<UserObject>> {
    const ids = userIds.map((userId) => {
      if (typeof userId === "number") {
        return userId.toString()
      } else return userId
    })

    this.logger.log(`Using user lookup endpoint for ids ${ids.join(", ")}`)

    const url = `${this.constants.usersLookupEndpoint}?user_id=${ids.join(",")}`

    try {
      const { data } = await this.http.get<Array<UserObject>>(url, {
        headers: {
          Authorization: this.oAuthService.oAuth01aHeader(url, "get"),
        },
      })
      return data
    } catch (err) {
      this.logger.error(err.response.data)
      return []
    }
  }

  async userShow(userId: string): Promise<UserObject> {
    this.logger.log(`Using user show endpoint for id ${userId}`)

    const url = `${this.constants.usersShowEndpoint}?user_id=${userId}`

    try {
      const { data } = await this.http.get<UserObject>(url, {
        headers: {
          Authorization: this.oAuthService.oAuth01aHeader(url, "get"),
        },
      })
      return data
    } catch (err) {
      this.logger.error(err)
    }
  }
}
