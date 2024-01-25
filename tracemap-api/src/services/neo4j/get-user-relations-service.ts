import { Relations } from 'tracemap-api-types'
import { db } from './driver'

export async function getUserRelations(handles: string[]): Promise<Relations> {
  const { records, keys } = await db.executeQuery(
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

  return {
    followingRelations: records[0].get('followingRelations'),
    handlesInDatabase: records[0].get('foundHandles'),
  }
}
