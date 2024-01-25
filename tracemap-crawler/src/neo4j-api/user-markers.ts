import { db } from './driver'

interface UserMarkers {
  queuedAt: number | null
  crawledAt: number | null
}

export async function markUsersAsQueued(handles: string[]): Promise<void> {
  const {} = await db.executeQuery(
    `
    UNWIND $handles as acct
      MERGE (u:User {acct:acct})
      SET u.queued_at = timestamp()
  `,
    {
      handles,
    },
  )
}

export async function getUserMarkers(handles: string[]): Promise<Record<string, UserMarkers>> {
  console.log(`getting markers for ${handles}`)
  const { records } = await db.executeQuery(
    `
    UNWIND $handles as acct
      MATCH (u:User {acct:acct})
      RETURN u.queued_at as queuedAt, u.crawled_at as crawledAt, acct
  `,
    { handles },
  )

  const response: Record<string, UserMarkers> = {}

  records.forEach((record) => {
    const acct = record.get('acct') as string
    const crawledAt = record.get('crawledAt') as number | null
    const queuedAt = record.get('queuedAt') as number | null

    response[acct] = {
      crawledAt,
      queuedAt,
    }
  })
  return response
}
