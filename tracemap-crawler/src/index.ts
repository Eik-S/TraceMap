import { SQSEvent } from 'aws-lambda'
import { isDev } from './config'
import { CrawlResult, ErrorResult, crawlUserData } from './crawler/crawler'
import { validateSQSRecords } from './sqs-record-validation'
import { makeMillisHumanReadable } from '../utils/format-time'
import { Measure } from '../utils/measure'

export async function handler(event: SQSEvent): Promise<void> {
  const { validRecords, invalidRecords } = validateSQSRecords(event.Records)

  if (isDev) {
    invalidRecords.forEach(console.error)
  }

  for (const record of validRecords) {
    const crawlResults: CrawlResult[] = []
    const errorResults: ErrorResult[] = []
    const totalTimeMeasure = new Measure()
    for (const acct of record.handles) {
      const result = await crawlUserData({ accessToken: record.accessToken, acct })

      if (result.type === 'crawlResult') {
        console.log(
          `crawling ${acct} took
          ${makeMillisHumanReadable(result.mastodonRequestMillis)} (mastodon api)
          ${makeMillisHumanReadable(result.neo4jWriteMillis)} (neo4j write)\n`,
        )
        crawlResults.push(result)
      }

      if (result.type === 'errorResult') {
        errorResults.push(result)
      }
    }
    const totalMillis = totalTimeMeasure.stop()
    console.log(
      `#### successfully crawled ${record.handles.length} users in ${makeMillisHumanReadable(
        totalMillis,
      )}`,
    )
  }
}
