import { randomUUID } from 'crypto'
import { Context } from 'koa'
import { getAuthURL } from '../services/twitter-authentication'

export type CreateSessionResponse = {
  authURL: string
  sessionID: string
}

export async function createSessionController(ctx: Context): Promise<CreateSessionResponse | void> {
  const sessionID = randomUUID()
  const authURL = await getAuthURL(sessionID)
  ctx.status = 200
  ctx.body = { authURL, sessionID }
}
