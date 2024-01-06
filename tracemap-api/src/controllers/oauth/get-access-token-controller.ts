import { Context } from 'koa'
import { getAuthorizationCodeHeader, getServerQueryParam } from '../../utils/request-params'
import { getAccessToken } from '../../services/oauth/access-token'
import { GetAccessTokenResponse } from 'tracemap-api-types'

export async function getAccessTokenController(ctx: Context): Promise<void> {
  const server = getServerQueryParam(ctx)
  const authorizationCode = getAuthorizationCodeHeader(ctx)

  const accessToken = await getAccessToken(server, authorizationCode)

  if (typeof accessToken === 'undefined') {
    ctx.status = 401
    ctx.message = 'authorization-code already used or invalid'
    return
  }

  ctx.status = 200
  ctx.body = { accessToken } as GetAccessTokenResponse
}
