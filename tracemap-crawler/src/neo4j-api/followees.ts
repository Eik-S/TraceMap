import { QueryStatistics } from 'neo4j-driver'
import { db } from './driver'

export async function deleteFolloweesOfUser(
  userAcct: string,
): Promise<ReturnType<QueryStatistics['updates']>> {
  const { summary } = await db.executeQuery(
    `MATCH (u:User {acct: $userAcct})-[r:FOLLOWS]->() 
     REMOVE u.crawled_at
     DELETE r`,
    {
      userAcct,
    },
  )

  return summary.counters.updates()
}

export async function writeFolloweesOfUser(
  followeeAccts: string[],
  sourceAcct: string,
): Promise<ReturnType<QueryStatistics['updates']>> {
  const { summary } = await db.executeQuery(
    `MERGE (sourceUser:User {acct: $sourceAcct})
     WITH $followeeAccts as followees, sourceUser
     UNWIND followees as followeeAcct
        MERGE (followee:User {acct: followeeAcct})
        CREATE (sourceUser)-[:FOLLOWS]->(followee)
     WITH distinct sourceUser
     SET sourceUser.crawled_at = timestamp()
     
    `,
    {
      sourceAcct,
      followeeAccts,
    },
  )
  return summary.counters.updates()
}
