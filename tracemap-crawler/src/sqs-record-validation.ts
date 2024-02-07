import { SQSRecord } from 'aws-lambda'

export interface CrawlRequest {
  handles: string[]
  accessToken: string
}

interface ValidationResponse {
  validRecords: CrawlRequest[]
  invalidRecords: Error[]
}

export function validateSQSRecords(records: SQSRecord[]): ValidationResponse {
  const validRecords: CrawlRequest[] = []
  const invalidRecords: Error[] = []

  for (const record of records) {
    try {
      const validRecord = validateSQSRecord(record)
      validRecords.push(validRecord)
    } catch (error) {
      if (error instanceof Error) {
        invalidRecords.push(error)
      }
    }
  }

  return {
    validRecords,
    invalidRecords,
  }
}
function validateSQSRecord(record: SQSRecord): CrawlRequest {
  const { body } = record

  const message = JSON.parse(body) as { [key: string]: unknown }
  if (isCrawlRequest(message)) {
    return message
  }

  throw new Error('not a valid crawl request', message)
}

export function isCrawlRequest(message: any): message is CrawlRequest {
  if (typeof message !== 'object') {
    return false
  }

  const hasProperties = 'accessToken' in message && 'handles' in message
  if (hasProperties === false) {
    return false
  }

  const handles = message.handles

  if (isStringArray(handles) === false) {
    return false
  }

  handles.forEach((val) => {
    if (val.indexOf('@') === -1) {
      return false
    }
  })

  return true
}

function isStringArray(input: any): input is string[] {
  const isArray = Array.isArray(input)
  return isArray && typeof input.find((val) => typeof val !== 'string') === 'undefined'
}
