import { Context } from 'koa'
import { getRebloggedByUsers } from '../../services/mastodon/get-reblogged-by-users'
import {
  getAccessTokenHeader,
  getServerQueryParam,
  getStatusIDQueryParam,
} from '../../utils/request-params'
import { MastoRecordNotFoundError } from '../../utils/errors'

export async function rebloggedByController(ctx: Context) {
  const server = getServerQueryParam(ctx)
  const statusID = getStatusIDQueryParam(ctx)
  const accessToken = getAccessTokenHeader(ctx)

  try {
    const rebloggedByUsers = await getRebloggedByUsers({ server, statusID, accessToken })

    ctx.status = 200
    ctx.body = rebloggedByUsers
  } catch (error: unknown) {
    if (error instanceof MastoRecordNotFoundError) {
      ctx.status = error.statusCode
      ctx.message = error.message
    }
  }
}
