import { Context } from 'koa'
import { InvalidStateIDError, TwitterAuthenticationError } from '../errors'
import { createAccessToken } from '../services/twitter-authentication'

export type ActivateSessionRequest = {
  sessionID: string
  state: string
  code: string
}

export type ActivateSessionResponse = void

export async function activateSessionController(ctx: Context): Promise<void> {
  const { sessionID, state, code } = ctx.request.body as Partial<ActivateSessionRequest>

  if (
    typeof sessionID === 'undefined' ||
    typeof state === 'undefined' ||
    typeof code === 'undefined'
  ) {
    console.log(`required body keys are missing. ${JSON.stringify(ctx.request.body)}`)
    ctx.status = 400
    return
  }

  try {
    await createAccessToken(sessionID, state, code)
    ctx.body = 'OK'
    ctx.status = 200
    return
  } catch (error) {
    switch ((error as Error).constructor) {
      case InvalidStateIDError:
        console.log(`stateIDs did not match for session ${sessionID}`)
        ctx.status = 400
        return
      case TwitterAuthenticationError:
        ctx.status = 500
        return
      default:
        console.log(JSON.stringify(error, null, 2))
        ctx.status = 500
        return
    }
  }
}
