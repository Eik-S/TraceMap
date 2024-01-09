import { UserData } from 'tracemap-api-types'

export interface PreviewCard {
  url: string
  title: string
  description: string
  type: 'link' | 'photo' | 'video'
  image: string
}

export interface Status {
  id: string
  created_at: string
  url: string
  reblogs_count: number
  content: string
  account: UserData
  reblog: Status | null
  card: PreviewCard | null
}

export interface UserTimelineBatch {
  data: Status[]
  nextUrl?: string
}

interface MastoErrorResponse {
  error: string
}

export function useMastoClientApi() {
  async function getStatusInfo(server: string, id: string): Promise<Status> {
    const response = await fetch(`https://${server}/api/v1/statuses/${id}`)
    return await response.json()
  }

  async function getUserTimeline(
    server: string,
    id: string,
    nextPageUrl?: string,
  ): Promise<UserTimelineBatch> {
    const url = nextPageUrl || `https://${server}/api/v1/accounts/${id}/statuses?limit=40`
    const response = await fetch(url)
    const data = await response.json()

    if (isErrorResponse(data)) {
      console.error(data)
      return {
        data: [],
      }
    }

    const nextUrl = getNextBatchRequestUrl(response)

    return {
      data,
      nextUrl,
    }
  }

  function getNextBatchRequestUrl(response: Response): string | undefined {
    const linkHeaderValue = response.headers.get('link') as string | undefined
    if (typeof linkHeaderValue === 'undefined' || linkHeaderValue === null) {
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

  function isErrorResponse<T>(data: T | MastoErrorResponse): data is MastoErrorResponse {
    return typeof data === 'object' && data !== null && data.hasOwnProperty('error')
  }

  return {
    getStatusInfo,
    getUserTimeline,
  }
}
