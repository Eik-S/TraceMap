import axios, { AxiosError, AxiosResponse } from 'axios'
import { MastoErrorResponse, isErrorResponse } from '../oauth/client-id'
import { MastoRecordNotFoundError } from '../../utils/errors'
import { UserData } from 'tracemap-api-types'

interface GetRebloggedByUsersParams {
  server: string
  statusID: string
  accessToken: string
}

interface BatchResponse<T> {
  nextUrl?: string
  data: T[]
}

export async function getRebloggedByUsers({
  server,
  statusID,
  accessToken,
}: GetRebloggedByUsersParams): Promise<UserData[]> {
  const responseLimit = 80
  const url = `https://${server}/api/v1/statuses/${statusID}/reblogged_by?limit=${responseLimit}`

  const batchResponses: BatchResponse<UserData>[] = []
  const response = await getBatchOfRebloggedByUsers(url, accessToken)
  batchResponses.push(response!)

  while (typeof batchResponses[batchResponses.length - 1].nextUrl !== 'undefined') {
    const nextBatch = await getBatchOfRebloggedByUsers(
      batchResponses[batchResponses.length - 1].nextUrl!,
      accessToken,
    )
    batchResponses.push(nextBatch!)
  }

  return batchResponses.flatMap((response) => response.data)
}

async function getBatchOfRebloggedByUsers(
  url: string,
  accessToken: string,
): Promise<BatchResponse<UserData> | undefined> {
  try {
    const response = await axios.get<UserData[] | MastoErrorResponse>(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (isErrorResponse(response.data)) {
      throw new Error(response.data.error)
    }

    const data = response.data.map((user) => ({
      username: user.username,
      url: user.url,
      avatar: user.avatar,
      header: user.header,
      acct: user.acct,
      id: user.id,
      following_count: user.following_count,
      followers_count: user.followers_count,
      statuses_count: user.statuses_count,
      note: user.note,
    }))
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
