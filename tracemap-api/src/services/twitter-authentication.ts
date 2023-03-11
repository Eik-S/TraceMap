import { TwitterApi } from 'twitter-api-v2'
import { InvalidStateIDError, SessionExpiredError } from './../errors'
import { getActiveSession, getPendingSession, saveSession } from './data/session-storage'
import { redirectUri, requestOauthLink, requestUserAccessToken } from './twitter-api'

interface PendingSession {
  state: 'pending'
  stateID: string
  codeVerifier: string
  redirectUri: string
}

interface ActiveSession {
  state: 'active'
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface RevokedSession {
  state: 'revoked'
}

export type TwitterSession = PendingSession | ActiveSession | RevokedSession

export async function getAuthURL(sessionID: string): Promise<string> {
  const { url, codeVerifier, state } = await requestOauthLink()

  saveSession(sessionID, {
    state: 'pending',
    stateID: state,
    codeVerifier,
    redirectUri,
  })

  return url
}

export async function createAccessToken(
  sessionID: string,
  clientStateID: string,
  code: string,
): Promise<void> {
  const { stateID: dbStateID, codeVerifier, redirectUri } = await getPendingSession(sessionID)
  checkStateIDs(clientStateID, dbStateID)

  const { accessToken, expiresIn, refreshToken, client } = await requestUserAccessToken({
    code,
    codeVerifier,
    redirectUri,
  })

  await saveSession(sessionID, {
    state: 'active',
    accessToken,
    refreshToken: refreshToken!,
    expiresIn,
  })

  const { username } = (await client.currentUserV2()).data
  console.log(`Created Session for user https://twitter.com/${username}`)
}

export async function login(sessionID: string): Promise<string> {
  const client = await getSessionClient(sessionID)

  const { username } = (await client.currentUserV2()).data
  console.log(`Recreated Session for user https://twitter.com/${username}`)
  return username
}

export async function getSessionClient(sessionID: string): Promise<TwitterApi> {
  const { accessToken } = await getActiveSession(sessionID)

  try {
    return new TwitterApi(accessToken)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    throw new SessionExpiredError()
  }
}

function checkStateIDs(stateID1: string, stateID2: string) {
  if (stateID1 !== stateID2) {
    throw new InvalidStateIDError()
  }
}
