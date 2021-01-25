import * as request from "request"

export function promiseRequest(options: request.Options): Promise<any> {
  return new Promise(function (resolve, reject) {
    request(options, function (_, res, body) {
      if (body.includes("error")) {
        reject(body)
      } else if (res.statusCode == 200) {
        resolve(body)
      }
    })
  })
}
