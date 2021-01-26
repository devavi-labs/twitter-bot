import { Injectable, Logger } from "@nestjs/common"
import { Constants } from "src/constants"
import axiosRateLimit from "axios-rate-limit"
import axios from "axios"
import qs from "qs"
import { OAuthService } from "src/oAuth/oAuth.service"

@Injectable()
export class StatusService {
  constructor(
    private readonly oAuthService: OAuthService,
    private readonly constants: Constants
  ) {}

  private readonly logger = new Logger(StatusService.name)

  private http = axiosRateLimit(axios.create(), {
    maxRequests: 300,
    perMilliseconds: 1000 * 60 * 60 * 3, // 3 Hours
  })

  async update(text: string, inReplyToTweetId?: string) {
    const params = {
      status: text,
    }

    if (inReplyToTweetId) {
      params["in_reply_to_status_id"] = inReplyToTweetId
      params["auto_populate_reply_metadata"] = true
    }

    const url = `${this.constants.statusUpdateEndpoint}?${params}`

    try {
      await this.http.post(url, qs.stringify(params), {
        headers: {
          Authorization: this.oAuthService.oAuth01aHeader(url, "post", params),
        },
      })

      this.logger.log("Tweet sent")
    } catch (err) {
      this.logger.error(err.response.data)
    }
  }
}
