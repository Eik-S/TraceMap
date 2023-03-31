import { ApiResponseError, TwitterApi } from 'twitter-api-v2'
import { InvalidStateIDError, SessionExpiredError } from '../utils/errors'
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

  const { accessToken, expiresIn, refreshToken } = await requestUserAccessToken({
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
}

export async function login(sessionID: string): Promise<string> {
  try {
    const client = await getSessionClient(sessionID)
    const { username } = (await client.currentUserV2()).data
    return username
  } catch (error) {
    if (error instanceof ApiResponseError && error.code === 401) {
      throw new SessionExpiredError()
    }
    throw error
  }
}

export async function getSessionClient(sessionID: string): Promise<TwitterApi> {
  const { accessToken } = await getActiveSession(sessionID)
  return new TwitterApi(accessToken)
}

function checkStateIDs(stateID1: string, stateID2: string) {
  if (stateID1 !== stateID2) {
    throw new InvalidStateIDError()
  }
}
