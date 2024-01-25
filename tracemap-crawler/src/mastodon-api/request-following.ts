import axios, { AxiosError, AxiosResponse } from 'axios'
import { UserData } from 'tracemap-api-types'

interface MastodonBatchResponse<T> {
  nextUrl?: string
  data: T[]
}

export interface MastodonErrorResponse {
  error: string
  error_description?: string
}

interface RequestFollowingProps {
  userID: string
  server: string
  accessToken: string
}

/**
 * requests following users from mastodons api
 *
 * @param userID the requested maston userID
 * @param server the server of the requested user
 * @param accessToken the mastodon accessToken of the clienside TraceMap user
 */
export async function requestFollowing({
  userID,
  server,
  accessToken,
}: RequestFollowingProps): Promise<UserData[]> {
  const url = `https://${server}/api/v1/accounts/${userID}/following?limit=80`

  const batchResponses: MastodonBatchResponse<UserData>[] = []
  try {
    const response = await getBatchOfFollowees(url, accessToken)
    batchResponses.push(response)

    while (typeof batchResponses[batchResponses.length - 1].nextUrl !== 'undefined') {
      const nextBatch = await getBatchOfFollowees(
        batchResponses[batchResponses.length - 1].nextUrl!,
        accessToken,
      )
      batchResponses.push(nextBatch!)
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error({
        message: 'AxiosError while requesting followees',
        errorData: error.response?.data,
        userID,
        server,
        url,
      })
    }
  }

  const followees = batchResponses.flatMap((response) => response.data)
  console.debug({
    message: 'requested mastodon followees',
    userID,
    server,
    numberOfRequests: batchResponses.length,
    numberOfFollowees: followees.length,
  })
  return followees
}

async function getBatchOfFollowees(
  url: string,
  accessToken: string,
): Promise<MastodonBatchResponse<UserData>> {
  const response = await axios.get<UserData[] | MastodonErrorResponse>(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (isErrorResponse(response.data)) {
    throw new Error(response.data.error)
  }

  const data = response.data
  const nextUrl = getNextBatchRequestUrl(response)

  return {
    data,
    nextUrl,
  }
}

function getNextBatchRequestUrl(response: AxiosResponse): string | undefined {
  const linkHeaderValue = response.headers.link as string | undefined
  if (typeof linkHeaderValue === 'undefined') {
    return undefined
  }
  const links = linkHeaderValue.split(', ')
  const nextLinkObject = links.find((link) => link.includes('rel="next"'))
  if (nextLinkObject) {
    const nextLink = nextLinkObject.match(/.*<(.*)>.*/)![1]
    return nextLink
  }

  return undefined
}

export function isErrorResponse<T>(data: T | MastodonErrorResponse): data is MastodonErrorResponse {
  return typeof data === 'object' && data !== null && data.hasOwnProperty('error')
}
