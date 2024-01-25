import { db } from './driver'

export async function getLastCrawledTimestampOfUser(userAcct: string): Promise<number | undefined> {
  const { records, keys } = await db.executeQuery(
    `MATCH (u:User {acct:$userAcct}) WITH u.crawled_at as crawled_at RETURN crawled_at`,
    { userAcct },
  )
  return records[0]?.get('crawled_at')
}
