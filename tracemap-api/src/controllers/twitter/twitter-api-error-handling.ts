import { Context } from 'koa'
import { ApiResponseError } from 'twitter-api-v2'
import { TwitterApiLimitReachedError, TwitterNotAuthorizedError } from '../../utils/errors'

export function handleTwitterApiError(ctx: Context, error: unknown) {
  if (error instanceof ApiResponseError) {
    if (error.code === 401) {
      throw new TwitterNotAuthorizedError()
    }
    if (error.code === 429) {
      throw new TwitterApiLimitReachedError()
    }
  }
  ctx.status = 500
  ctx.body = 'unhandled Twitter API error on Server'

  throw error
}
