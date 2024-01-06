import { UserData } from 'tracemap-api-types'
import { apiUrl } from '../utils/config'
import { useLocalStorage } from '../utils/use-local-storage'

export function useTracemapMastoApi() {
  const accessToken = localStorage.getItem('access-token')
  const [server] = useLocalStorage('server', '')

  const isUsable = accessToken !== null && server !== ''

  async function verifyAccessToken(): Promise<UserData> {
    if (accessToken === null || server === '') {
      throw new Error(
        'access-token and server local storage objects mus be set to use tracemapMastoApi',
      )
    }

    const requestHeaders = new Headers()
    requestHeaders.append('access-token', accessToken)
    const response = await fetch(`${apiUrl}/masto/verify-access-token?server=${server}`, {
      headers: requestHeaders,
    })
    return response.json()
  }

  async function getRebloggedByUsers(statusID: string): Promise<UserData[] | undefined> {
    if (accessToken === null || server === '') {
      return undefined
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

  return {
    isUsable,
    verifyAccessToken,
    getRebloggedByUsers,
  }
}
