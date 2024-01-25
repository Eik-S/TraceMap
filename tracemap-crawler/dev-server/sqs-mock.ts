import { SQSEvent, SQSRecord, SQSRecordAttributes } from 'aws-lambda'
import * as crypto from 'crypto'

export function mockSQSEvent(records: SQSRecord[]): SQSEvent {
  return { Records: records }
}

export function mockSQSRecord(crawlRequest: unknown): SQSRecord {
  return {
    messageAttributes: {},
    body: JSON.stringify(crawlRequest),
    messageId: 'messageId-' + crypto.randomUUID(),
    receiptHandle: '',
    attributes: {} as SQSRecordAttributes,
    md5OfBody: '',
    eventSource: 'aws:sqs',
    eventSourceARN: '',
    awsRegion: '',
  }
}
