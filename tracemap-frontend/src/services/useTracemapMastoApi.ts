import { apiUrl } from '../utils/config'
import { useLocalStorage } from '../utils/use-local-storage'

export interface AccountData {
  username: string
  url: string
  avatar: string
  header: string
  acct: string
  id: string
  following_count: number
  followers_count: number
}

export function useTracemapMastoApi() {
  const accessToken = localStorage.getItem('access-token')
  const [server] = useLocalStorage('server', '')

  const isUsable = accessToken !== null && server !== ''

  async function verifyAccessToken(): Promise<AccountData> {
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

  async function getRebloggedByUsers(statusID: string): Promise<AccountData[] | undefined> {
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
