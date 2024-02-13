import { CrawlStatus, Relations } from 'tracemap-api-types'
import { db } from './driver'

export async function getUserRelations(handles: string[]): Promise<Relations> {
  const { records } = await db.executeQuery(
    `
    UNWIND $handles as acct
      MATCH (u:User {acct:acct})
    WITH COLLECT(u) AS users, COLLECT(u.acct) AS foundHandles
    UNWIND users AS u1
    UNWIND users AS u2
      MATCH path=(u1)-[r:FOLLOWS]->(u2)
    RETURN COLLECT([u1.acct,u2.acct]) as followingRelations, foundHandles`,
    { handles },
  )

  if (records.length === 0) {
    return {
      followingRelations: [],
      handlesInDatabase: [],
    }
  }

  return {
    followingRelations: records[0].get('followingRelations'),
    handlesInDatabase: records[0].get('foundHandles'),
  }
}

export async function getCrawledHandles(handles: string[]): Promise<CrawlStatus> {
  const oneDayInMillis = 1000 * 60 * 60 * 24
  const oneDayAgo = Date.now() - oneDayInMillis
  const { records } = await db.executeQuery(
    `
    UNWIND $handles as acct
      MATCH (u:User {acct:acct})
      WHERE (u.crawled_at > $oneDayAgo)
    RETURN COLLECT(u.acct) AS handlesCrawled
    `,
    { handles, oneDayAgo },
  )

  return {
    handlesCrawled: records[0].get('handlesCrawled'),
  }
}
