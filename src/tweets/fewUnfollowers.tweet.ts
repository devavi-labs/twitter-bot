export const fewUnfollowersTweet = (
  name: string,
  username: string,
  unfollowersUsernames: Array<string>
) => `@${username} don't worry ${
  name.split(" ")[0]
}, just a few unfollowers today
${unfollowersUsernames.map((username) => `@/${username}`).join(", ")}
`
