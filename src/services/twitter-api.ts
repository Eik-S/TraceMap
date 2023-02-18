import { TwitterApi, UserV2 } from 'twitter-api-v2'

async function getFollowers(client: TwitterApi, userId: string): Promise<UserV2[]> {
  const response = await client.v2.following(userId, { max_results: 1000 })
  return response.data
}

function pickRandomFollower(followers: UserV2[]): UserV2 {
  const index = Math.floor(Math.random() * followers.length)
  return followers[index]
}
