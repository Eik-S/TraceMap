import { apiUrl, redirectUrl } from '../utils/config'

export function useTracemapLoginApi() {
  async function loginWithMastodon(server: string) {
    try {
      const { clientId } = await getClientId(server)
      await triggerRedirectingAuthorize(clientId, server)
    } catch (error) {
      console.error(error)
    }
  }

  async function triggerRedirectingAuthorize(clientId: string, server: string): Promise<void> {
    const queryparams = [
      `client_id=${clientId}`,
      'scope=read',
      `redirect_uri=${redirectUrl}`,
      'response_type=code',
    ]
    window.location.href = `https://${server}/oauth/authorize?${queryparams.join('&')}`
  }

  async function getClientId(server: string): Promise<{ clientId: string }> {
    const response = await fetch(`${apiUrl}/login/get-client-id?server=${server}`)
    return response.json()
  }

  async function getAccessToken(
    server: string,
    authorizationCode: string,
  ): Promise<{ accessToken: string }> {
    const requestHeaders = new Headers()
    requestHeaders.append('authorization-code', authorizationCode)
    const response = await fetch(`${apiUrl}/login/get-access-token?server=${server}`, {
      headers: requestHeaders,
    })
    return response.json()
  }

  return {
    loginWithMastodon,
    getAccessToken,
  }
}
