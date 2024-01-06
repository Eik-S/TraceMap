import { Context } from 'koa'
import { getClientId } from '../../services/oauth/client-id'
import { getServerQueryParam } from '../../utils/request-params'
import { GetClientIdResponse } from 'tracemap-api-types'

export type CreateSessionResponse = {
  authURL: string
  sessionID: string
}

export async function getClientIdController(ctx: Context): Promise<void> {
  const server = getServerQueryParam(ctx)
  const forceUpdate = ctx.querystring.includes('forceUpdate=true')

  const clientId = await getClientId(server, forceUpdate)
  ctx.status = 200
  ctx.body = { clientId } as GetClientIdResponse
}
