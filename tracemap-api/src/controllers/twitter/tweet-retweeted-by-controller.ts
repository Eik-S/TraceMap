import { Context } from 'koa'
import { TweetV2LikedByResult } from 'twitter-api-v2'
import { getSessionClient } from '../../services/twitter-authentication'

interface GetTweetRetweetedByParams {
  sessionID: string
  tweetID: string
}

export async function tweetRetweetedByController(
  ctx: Context,
): Promise<TweetV2LikedByResult | void> {
  const { sessionID, tweetID } = ctx.request.body as Partial<GetTweetRetweetedByParams>

  if (typeof sessionID === 'undefined' || typeof tweetID === 'undefined') {
    console.log(`required body keys are missing. ${JSON.stringify(ctx.request.body)}`)
    ctx.status = 400
    return
  }

  const client = await getSessionClient(sessionID)
  const response = await client.v2.tweetRetweetedBy(tweetID, {
    'user.fields': ['id', 'name', 'username', 'profile_image_url'],
    'tweet.fields': ['created_at'],
  })
  ctx.status = 200
  ctx.body = response
}
