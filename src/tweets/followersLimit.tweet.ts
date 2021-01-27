export const followersLimitTweet = (
  name: string,
  username: string,
  limit: number
) =>
  `@${username} uh-oh, we're so sorry ${
    name.split(" ")[0]
  }, you have gained followers more than ${limit} and we need to say goodbye`
