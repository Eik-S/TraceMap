import { Context } from 'koa'
import { TweetV2 } from 'twitter-api-v2'
import { getSessionClient } from '../../services/twitter-authentication'
import { handleTwitterApiError } from './twitter-api-error-handling'
import { MissingParameterError } from '../../utils/errors'

interface GetTweetInfoParams {
  sessionID: string
  tweetID: string
}

export async function tweetInfoController(ctx: Context): Promise<TweetV2 | void> {
  const { sessionID, tweetID } = ctx.request.body as Partial<GetTweetInfoParams>

  if (typeof sessionID === 'undefined' || typeof tweetID === 'undefined') {
    console.log(`required body keys are missing. ${JSON.stringify(ctx.request.body)}`)
    throw new MissingParameterError()
  }

  const client = await getSessionClient(sessionID)

  try {
    const response = await client.v2.singleTweet(tweetID, {
      'tweet.fields': 'public_metrics',
    })
    ctx.status = 200
    ctx.body = response.data
  } catch (error) {
    handleTwitterApiError(ctx, error)
  }
}
