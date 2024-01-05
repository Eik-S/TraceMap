import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import {
  SessionExpiredError,
  SessionNotFoundError,
  SessionNotPendingError,
} from '../../utils/errors'

const tableName = 'tracemap-sessions'

const bareClient = new DynamoDBClient({ region: 'eu-central-1' })
const ddb = DynamoDBDocumentClient.from(bareClient)

export async function saveSession(sessionID: string, session: any): Promise<void> {
  const expirationTimestamp = Math.floor(Date.now() / 1000) + 3600 * 48 // set to 2 days from now
  await ddb.send(
    new PutCommand({ TableName: tableName, Item: { ...session, sessionID, expirationTimestamp } }),
  )
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

export async function getSession(sessionID: string): Promise<any> {
  const { Item } = await ddb.send(new GetCommand({ TableName: tableName, Key: { sessionID } }))

  if (typeof Item === 'undefined') {
    throw new SessionNotFoundError()
  }

  return Item
}

export async function hasSession(sessionId: string): Promise<boolean> {
  try {
    await getSession(sessionId)
    return true
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      return false
    }
    throw error
  }
}
