import { SessionNotFoundError } from './../../errors'
import { createClient } from 'redis'
import { TwitterSession } from '../twitter-authentication'

const redisClient = createClient()
redisClient.on('error', (error) => console.log('Redis error: ', error))

export async function saveSession(sessionID: string, session: TwitterSession): Promise<void> {
  await connectRedisClient()
  await redisClient.set(sessionID, JSON.stringify(session))
}

export async function getSession(sessionId: string): Promise<TwitterSession> {
  await connectRedisClient()
  const sessionString = await redisClient.get(sessionId)

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
