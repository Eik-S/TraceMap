import { randomUUID } from 'crypto'
import { Context } from 'koa'
import { SessionAlreadyExistsError } from '../errors'
import { getAuthURL } from '../services/twitter-authentication'

export type CreateSessionResponse = {
  authURL: string
  sessionID: string
}

export async function createSessionController(ctx: Context): Promise<CreateSessionResponse | void> {
  const sessionID = randomUUID()
  try {
    const authURL = await getAuthURL(sessionID)
    ctx.status = 200
    ctx.body = { authURL, sessionID }
    return
  } catch (error) {
    if (error instanceof SessionAlreadyExistsError) {
      ctx.status = 409
      return
    }

    console.log(JSON.stringify(error, null, 2))
  }
}
