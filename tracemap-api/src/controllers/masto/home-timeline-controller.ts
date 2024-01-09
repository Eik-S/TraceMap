import { Context } from 'koa'
import { MastoRecordNotFoundError } from '../../utils/errors'
import {
  getAccessTokenHeader,
  getNextPageUrlQueryParam,
  getServerQueryParam,
} from '../../utils/request-params'
import { getHomeTimelineBatch } from '../../services/mastodon/get-home-timeline'
import { UserTimelineBatch } from 'tracemap-api-types'

export async function homeTimelineController(ctx: Context): Promise<void | UserTimelineBatch> {
  const accessToken = getAccessTokenHeader(ctx)
  const server = getServerQueryParam(ctx)
  const nextPageUrl = getNextPageUrlQueryParam(ctx)

  try {
    const homeTimelineBatch = await getHomeTimelineBatch({ server, accessToken, nextPageUrl })

    ctx.status = 200
    ctx.body = homeTimelineBatch
  } catch (error: unknown) {
    if (error instanceof MastoRecordNotFoundError) {
      ctx.status = error.statusCode
      ctx.message = error.message
    }
  }
}
