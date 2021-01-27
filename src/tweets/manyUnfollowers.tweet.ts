export const manyUnfollowersTweet = (
  name: string,
  username: string,
  unfollowersUsernames: Array<string>
) => `@${username} damn ${name.split(" ")[0]}, so many unfollowers today
${unfollowersUsernames.map((username) => `@/${username}`).join(", ")}
`
