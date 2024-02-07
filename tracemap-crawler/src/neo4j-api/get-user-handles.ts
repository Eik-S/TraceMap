import { db } from './driver'

interface UserMarkers {
  queuedAt: number | null
  crawledAt: number | null
}

/**
 * searches for outdated user handles in the database, marks the matching users as queued and returns their handles.
 * @param handles handles to look up in the database
 * @param timeframe timespan in milliseconds, only return handles not crawled since that timespan
 * @returns
 */
export async function getOutdatedUserHandles(
  handles: string[],
  timeframe: number,
): Promise<string[]> {
  const outdatedFrom = Date.now() - timeframe
  const { records } = await db.executeQuery(
    `
    UNWIND $handles as acct
      MERGE (u:User {acct:acct})
      ON CREATE
        SET u.crawled_at = 0
      WITH u as oldy WHERE u.crawled_at < $outdatedFrom
      SET oldy.queued_at = timestamp()
      RETURN collect(oldy.acct) as outdatedHandles
  `,
    {
      handles,
      outdatedFrom,
    },
  )

  return records[0]?.get('outdatedHandles')
}
