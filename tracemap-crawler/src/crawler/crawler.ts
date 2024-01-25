import { makeMillisHumanReadable } from '../../utils/format-time'
import { Measure } from '../../utils/measure'
import { requestFollowing } from '../mastodon-api/request-following'
import { lookupUserID } from '../mastodon-api/user-lookup'
import { deleteFolloweesOfUser, writeFolloweesOfUser } from '../neo4j-api/followees'
import { getLastCrawledTimestampOfUser } from '../neo4j-api/user-info'

const oneDayInMillis = 1000 * 60 * 60 * 24

export interface CrawlUserDataProps {
  acct: string
  accessToken: string
}
export interface CrawlResult {
  type: 'crawlResult'
  mastodonRequestMillis: number
  neo4jWriteMillis: number
  skipped: boolean
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

    // check if new crawl is necessary
    const lastCrawlTimestamp = await getLastCrawledTimestampOfUser(sourceAcct)
    const millisSinceLastCrawl = Date.now() - (lastCrawlTimestamp || oneDayInMillis)
    if (millisSinceLastCrawl < oneDayInMillis) {
      const age = makeMillisHumanReadable(millisSinceLastCrawl)
      console.log(`${sourceAcct} up to date, last crawled ${age} ago`)

      return {
        type: 'crawlResult',
        skipped: true,
        mastodonRequestMillis: 0,
        neo4jWriteMillis: 0,
      }
    }

    // lookup userID on home instance
    const userID = await lookupUserID(sourceAcct)
    if (typeof userID === 'undefined') {
      return {
        type: 'errorResult',
        message: `could not lookup user ${sourceAcct}`,
      }
    }

    // get followees from mastodon
    const mastodonMeasure = new Measure()
    const followees = await getUserFollowees({
      server: parseServerFromAcctHandle(sourceAcct),
      userID,
      accessToken,
    })
    const mastodonRequestTime = mastodonMeasure.stop()

    // update neo4j relations
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
      skipped: false,
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
