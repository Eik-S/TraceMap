import { Context } from 'koa'
import { MissingParameterError, SessionExpiredError, SessionNotFoundError } from '../utils/errors'
import { login } from '../services/twitter-authentication'

export type RestoreSessionRequest = {
  sessionID: string
}

export type RestoreSessionResponse = {
  username: string
}

export async function restoreSessionController(
  ctx: Context,
): Promise<RestoreSessionResponse | void> {
  const { sessionID } = ctx.request.body as Partial<RestoreSessionRequest>

  if (typeof sessionID === 'undefined') {
    console.log(`required sessionID key missing.`)
    throw new MissingParameterError()
  }

  const username = await login(sessionID)
  ctx.body = { username }
  ctx.status = 200
}
