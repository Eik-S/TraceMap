import { Measure } from '../../utils/measure'
import { requestFollowing } from '../mastodon-api/request-following'
import { lookupUserID } from '../mastodon-api/user-lookup'
import { deleteFolloweesOfUser, writeFolloweesOfUser } from '../neo4j-api/write-followees'

export interface CrawlUserDataProps {
  acct: string
  accessToken: string
}
export interface CrawlResult {
  type: 'crawlResult'
  mastodonRequestMillis: number
  neo4jWriteMillis: number
}
export interface ErrorResult {
  type: 'errorResult'
  message: string
}
/**
 * requests a users followees (the users a user is following)
 * and saves them to the TraceMap Social Graph
 *
 * @param userID the userID to request followees from
 * @param accessToken the mastodon accessToken of the clientside TraceMap user
 */
export async function crawlUserData(
  requestData: CrawlUserDataProps,
): Promise<CrawlResult | ErrorResult> {
  try {
    const { acct: sourceAcct, accessToken } = requestData

    const followees: string[] = []

    const mastodonMeasure = new Measure()
    try {
      // lookup userID on home instance
      const userID = await lookupUserID(sourceAcct)
      if (typeof userID === 'undefined') {
        throw new Error(`could not lookup user ${sourceAcct}`)
      }

      // get followees from mastodon
      const mastodonFolloweeHandles = await getUserFollowees({
        server: parseServerFromAcctHandle(sourceAcct),
        userID,
        accessToken,
      })
      followees.push(...mastodonFolloweeHandles)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
    const mastodonRequestTime = mastodonMeasure.stop()

    // update neo4j relations
    // TODO: if deadlocks are received from neo4j when scaling to multiple
    // lambdas, sqs can be used as a buffer with an own lambda in front of neo4j
    const neo4jWriteMeasure = new Measure()
    const { relationshipsDeleted } = await deleteFolloweesOfUser(sourceAcct)
    console.log(`${relationshipsDeleted} follows relationships deleted from ${sourceAcct}`)
    const { nodesCreated, relationshipsCreated } = await writeFolloweesOfUser(followees, sourceAcct)
    console.log(
      `${nodesCreated} new users and ${relationshipsCreated} follows relationships created from ${sourceAcct}`,
    )
    const neo4jWriteTime = neo4jWriteMeasure.stop()

    return {
      type: 'crawlResult',
      mastodonRequestMillis: mastodonRequestTime,
      neo4jWriteMillis: neo4jWriteTime,
    }
  } catch (error) {
    throw error
  }
}

export interface GetUserFolloweesProps {
  userID: string
  server: string
  accessToken: string
}

/**
 * request a users followees from mastodon
 *
 * @param userID the userID to request followees from
 * @param serverURL the URL of the users mastodon instance
 * @param accessToken the mastodon accessToken of the clientside TraceMap user
 *
 * @returns a list of acct handles the input user is following
 */
export async function getUserFollowees({
  userID,
  server,
  accessToken,
}: GetUserFolloweesProps): Promise<string[]> {
  const followingUsers = await requestFollowing({
    userID,
    server,
    accessToken,
  })

  const followeesAcctHandles = followingUsers.map((user) => user.acct)

  return addMissingServerToAcctHandles(followeesAcctHandles, server)
}

function addMissingServerToAcctHandles(handles: string[], sourceServer: string) {
  return handles.map((handle) => {
    if (handle.indexOf('@') === -1) {
      return `${handle}@${sourceServer}`
    }

    return handle
  })
}

function parseServerFromAcctHandle(acct: string) {
  return acct.slice(acct.indexOf('@') + 1)
}
