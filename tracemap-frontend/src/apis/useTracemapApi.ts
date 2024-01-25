import { apiUrl } from '../utils/config'

export function useTracemapApi() {
  const accessToken = localStorage.getItem('access-token')

  const isUsable = accessToken !== null

  async function sendCrawlRequest(handles: string[]): Promise<void> {
    if (accessToken === null) {
      throw new Error('accessToken has to be set to use tracemap masto api')
    }

    const requestHeaders = new Headers()
    requestHeaders.append('access-token', accessToken)
    requestHeaders.append('Content-Type', 'application/json')

    void (await fetch(`${apiUrl}/tracemap/request-crawling`, {
      headers: requestHeaders,
      method: 'POST',
      body: JSON.stringify({ handles }),
    }))
  }

  return {
    isUsable,
    sendCrawlRequest,
  }
}
