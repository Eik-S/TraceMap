import { InvalidStateIDError } from '@/errors'
import { createAccessToken } from '@/services/twitter-authentication'
import type { NextApiRequest, NextApiResponse } from 'next'

export type ActivateSessionRequest = {
  sessionID: string
  state: string
  code: string
}

export type ActivateSessionResponse = void

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActivateSessionResponse>,
) {
  const { sessionID, state, code } = req.body as Partial<ActivateSessionRequest>
  if (
    typeof sessionID === 'undefined' ||
    typeof state === 'undefined' ||
    typeof code === 'undefined'
  ) {
    console.log(`required body keys are missing.`)
    res.status(400).send()
    return
  }

  try {
    await createAccessToken(sessionID, state, code)
    res.status(200).send()
  } catch (error) {
    switch ((error as Error).constructor) {
      case InvalidStateIDError:
        console.log(`stateIDs did not match for session ${sessionID}`)
        res.status(400).send()
        return
      default:
        console.log(JSON.stringify(error, null, 2))
    }
  }
}
