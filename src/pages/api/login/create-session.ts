import { SessionAlreadyExistsError, SessionExpiredError, SessionNotFoundError } from '@/errors'
import { getAuthURL } from '@/services/twitter-authentication'
import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'

export type CreateSessionResponse = {
  authURL: string
  sessionID: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSessionResponse | void>,
) {
  const sessionID = randomUUID()
  try {
    const authURL = await getAuthURL(sessionID)
    res.status(200).json({ authURL, sessionID })
  } catch (error) {
    if (error instanceof SessionAlreadyExistsError) {
      res.status(409).send()
      return
    }

    console.log(JSON.stringify(error, null, 2))
  }
}
