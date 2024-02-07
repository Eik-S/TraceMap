import { SQSEvent } from 'aws-lambda'
import { isDev } from './config'
import { crawlTracemap } from './crawler/tracemap-crawler'
import { validateSQSRecords } from './sqs-record-validation'

export async function handler(event: SQSEvent): Promise<void> {
  const { validRecords, invalidRecords } = validateSQSRecords(event.Records)

  if (isDev) {
    invalidRecords.forEach(console.error)
    // TODO: delete message from queue
  }

  for (const record of validRecords) {
    const handles = record.handles
    const accessToken = record.accessToken
    crawlTracemap(handles, accessToken)
  }
}
