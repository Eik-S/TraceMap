import { Context } from 'koa'
import { getAccessTokenHeader, getServerQueryParam } from '../../utils/request-params'
import { verifyAccessToken } from '../../services/mastodon/verify-access-token'

export async function verifyAccessTokenController(ctx: Context) {
  const server = getServerQueryParam(ctx)
  const accessToken = getAccessTokenHeader(ctx)

  const userInfo = await verifyAccessToken(server, accessToken)

  ctx.status = 200
  ctx.body = userInfo
}
