import { SessionExpiredError, SessionNotFoundError, SessionNotPendingError } from './../../errors'
import { createClient } from 'redis'
import { TwitterSession } from '../twitter-authentication'

const redisClient = createClient({
  url: 'redis://redis:6379',
})
redisClient.on('error', (error) => console.log('Redis error: ', error))

export async function saveSession(sessionID: string, session: TwitterSession): Promise<void> {
  await connectRedisClient()
  await redisClient.set(sessionID, JSON.stringify(session))
}

export async function getPendingSession(sessionID: string) {
  const session = await getSession(sessionID)

  if (session.state !== 'pending') {
    throw new SessionNotPendingError()
  }

  return session
}

export async function getActiveSession(sessionID: string) {
  const session = await getSession(sessionID)

  if (session.state !== 'active') {
    throw new SessionExpiredError()
  }

  return session
}

export async function getSession(sessionID: string): Promise<TwitterSession> {
  await connectRedisClient()
  const sessionString = await redisClient.get(sessionID)

  if (typeof sessionString !== 'string') {
    throw new SessionNotFoundError()
  }

  return JSON.parse(sessionString)
}

export async function hasSession(sessionId: string): Promise<boolean> {
  await connectRedisClient()
  const exists = await redisClient.exists(sessionId)
  return exists === 1 ? true : false
}

async function connectRedisClient() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
}
