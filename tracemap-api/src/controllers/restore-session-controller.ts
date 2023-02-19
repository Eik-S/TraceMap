import { Context } from 'koa'
import { SessionExpiredError } from '../errors'
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
    console.log(`required sessionID key are missing.`)
    ctx.status = 400
    return
  }

  try {
    const username = await login(sessionID)
    ctx.body = { username }
    ctx.status = 200
    return
  } catch (error) {
    switch ((error as Error).constructor) {
      case SessionExpiredError:
        ctx.box = { message: 'Session expired' }
        ctx.status = 401
        return
      default:
        console.log((error as Error).constructor)
        console.log(JSON.stringify(error, null, 2))
        ctx.status = 500
        return
    }
  }
}
