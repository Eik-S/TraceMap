import { SessionExpiredError, SessionNotFoundError } from '@/errors'
import { login } from '@/services/twitter-authentication'
import type { NextApiRequest, NextApiResponse } from 'next'

export type LoginRequest = {
  sessionID: string
}

export type LoginResponse = void

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  const { sessionID } = req.body as Partial<LoginRequest>
  if (typeof sessionID === 'undefined') {
    res.redirect('/login')
    return
  }

  try {
    await login(sessionID)
    res.status(200).send()
  } catch (error) {
    switch ((error as Error).constructor) {
      case SessionExpiredError:
      case SessionNotFoundError:
        res.status(401).send()
        return
      default:
        console.log(JSON.stringify(error, null, 2))
    }
  }
}
