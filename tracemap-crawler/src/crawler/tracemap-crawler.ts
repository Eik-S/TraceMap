import { makeMillisHumanReadable } from '../../utils/format-time'
import { Measure } from '../../utils/measure'
import { getOutdatedUserHandles } from '../neo4j-api/get-user-handles'
import { CrawlResult, ErrorResult, crawlUserData } from './user-crawler'

export async function crawlTracemap(handles: string[], accessToken: string): Promise<void> {
  const totalTimeMeasure = new Measure()

  const oneDayInMillis = 1000 * 60 * 60 * 24
  const handlesToCrawl = await getOutdatedUserHandles(handles, oneDayInMillis)

  console.log(`crawling ${handlesToCrawl.length} of the ${handles.length} requested users`)

  for (const handle of handlesToCrawl) {
    const result = await crawlUserData({ accessToken: accessToken, acct: handle })
    processResult(result, handle)
  }

  const totalMillis = totalTimeMeasure.stop()
  console.log(
    `#### successfully crawled ${handles.length} users in ${makeMillisHumanReadable(totalMillis)}`,
  )
}

function processResult(result: CrawlResult | ErrorResult, handle: string) {
  if (result.type === 'crawlResult') {
    processCrawlResult(result, handle)
  }

  if (result.type === 'errorResult') {
    processErrorResult(result, handle)
  }
}

function processCrawlResult(result: CrawlResult, handle: string) {
  console.log(
    `crawling ${handle} took
            ${makeMillisHumanReadable(result.mastodonRequestMillis)} (mastodon api)
            ${makeMillisHumanReadable(result.neo4jWriteMillis)} (neo4j write)\n`,
  )
}

function processErrorResult(result: ErrorResult, handle: string) {
  console.error(
    `crawling ${handle} failed with error:
        ${result.message}`,
  )
}
