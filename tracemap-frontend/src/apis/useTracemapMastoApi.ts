import { UserData } from 'tracemap-api-types'
import { apiUrl } from '../utils/config'

export function useTracemapMastoApi() {
  const accessToken = localStorage.getItem('access-token')

  const isUsable = accessToken !== null

  async function verifyAccessToken(server: string): Promise<UserData> {
    if (accessToken === null) {
      throw new Error('accessToken has to be set to use tracemap masto api')
    }

    const requestHeaders = new Headers()
    requestHeaders.append('access-token', accessToken)
    const response = await fetch(`${apiUrl}/masto/verify-access-token?server=${server}`, {
      headers: requestHeaders,
    })
    return response.json()
  }

  async function getRebloggedByUsers(
    server: string,
    statusID: string,
  ): Promise<UserData[] | undefined> {
    if (accessToken === null) {
      throw new Error('accessToken has to be set to use tracemap masto api')
    }

    const requestHeaders = new Headers()
    requestHeaders.append('access-token', accessToken)
    const response = await fetch(
      `${apiUrl}/masto/reblogged-by?server=${server}&statusID=${statusID}`,
      {
        headers: requestHeaders,
      },
    )
    return response.json()
  }

  async function getHomeTimeline(server: string, nextPageUrl?: string) {
    if (accessToken === null) {
      throw new Error('accessToken has to be set to use tracemap masto api')
    }

    const requestHeaders = new Headers()
    requestHeaders.append('access-token', accessToken)
    const requestQueryparams = new URLSearchParams()
    requestQueryparams.set('server', server)
    if (typeof nextPageUrl !== 'undefined') {
      requestQueryparams.set('nextPageUrl', nextPageUrl)
    }
    const response = await fetch(
      `${apiUrl}/masto/timelines/home?${requestQueryparams.toString()}`,
      {
        headers: requestHeaders,
      },
    )
    return response.json()
  }

  return {
    isUsable,
    verifyAccessToken,
    getRebloggedByUsers,
    getHomeTimeline,
  }
}
