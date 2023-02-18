import { InvalidStateIDError, SessionAlreadyExistsError, SessionExpiredError } from '@/errors'
import { TwitterApi } from 'twitter-api-v2'
import { getSession, hasSession, saveSession } from './data/redis-session-storage'

interface PendingSession {
  state: 'pending'
  authURL: string
  twitterStateId: string
  codeVerifier: string
}

interface ActiveSession {
  state: 'active'
  accessToken: string
  expiresIn: number
}

interface RevokedSession {
  state: 'revoked'
}

export type TwitterSession = PendingSession | ActiveSession | RevokedSession

const redirectURL = 'http://localhost:3000/login/callback'

export async function getAuthURL(sessionID: string): Promise<string> {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  })

  if (await hasSession(sessionID)) {
    throw new SessionAlreadyExistsError()
  }

  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(redirectURL, {
    scope: ['tweet.read', 'users.read', 'follows.read', 'offline.access'],
  })

  const pendingSession: PendingSession = {
    state: 'pending',
    authURL: url,
    twitterStateId: state,
    codeVerifier,
  }
  console.log(`saving codeVerifier: ${codeVerifier}`)
  saveSession(sessionID, pendingSession)

  return url
}

export async function createAccessToken(
  sessionID: string,
  clientTwitterStateId: string,
  code: string,
): Promise<void> {
  const session = await getSession(sessionID)

  if (session.state === 'pending') {
    const { twitterStateId, codeVerifier } = session

    if (twitterStateId !== clientTwitterStateId) {
      throw new InvalidStateIDError()
    }

    const client = new TwitterApi({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    })

    const {
      accessToken,
      expiresIn,
      client: userClient,
    } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: redirectURL,
    })

    const activeSession: ActiveSession = {
      state: 'active',
      accessToken,
      expiresIn,
    }

    saveSession(sessionID, activeSession)

    const { username } = (await userClient.currentUserV2()).data
    console.log(`Created Session for user https://twitter.com/${username}`)
  }
}

export async function login(sessionID: string): Promise<void> {
  const session = await getSession(sessionID)

  if (session.state !== 'active') {
    throw new SessionExpiredError()
  }

  const { accessToken } = session

  const client = new TwitterApi(accessToken)

  const { username } = (await client.currentUserV2()).data
  console.log(`Created Session for user https://twitter.com/${username}`)
}
