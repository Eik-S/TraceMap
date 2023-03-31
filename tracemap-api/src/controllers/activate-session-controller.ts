import { Context } from 'koa'
import { InvalidStateIDError, MissingParameterError } from '../utils/errors'
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
    throw new MissingParameterError()
  }

  await createAccessToken(sessionID, state, code)
  ctx.body = 'OK'
  ctx.status = 200
}
