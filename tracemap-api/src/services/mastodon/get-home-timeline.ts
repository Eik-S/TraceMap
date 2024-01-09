import axios, { AxiosError, AxiosResponse } from 'axios'
import { MastoErrorResponse, isErrorResponse } from '../oauth/client-id'
import { MastoRecordNotFoundError } from '../../utils/errors'
import { Status, UserTimelineBatch } from 'tracemap-api-types'

interface GetHomeTimelineParams {
  accessToken: string
  server: string
  nextPageUrl?: string
}

export async function getHomeTimelineBatch({
  accessToken,
  server,
  nextPageUrl,
}: GetHomeTimelineParams): Promise<UserTimelineBatch | undefined> {
  const url = nextPageUrl || `https://${server}/api/v1/timelines/home?limit=40`
  try {
    const response = await axios.get<Status[] | MastoErrorResponse>(url, {
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
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new MastoRecordNotFoundError()
      }
    }
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
