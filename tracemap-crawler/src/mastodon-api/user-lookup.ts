import axios, { AxiosError } from 'axios'
import { UserData } from 'tracemap-api-types'
import { MastodonErrorResponse, isErrorResponse } from './request-following'

/**
 * @param acct the users unique username on this server
 * @param server the server to request the id from
 * @returns the userID string
 */
export async function lookupUserID(acct: string): Promise<string | undefined> {
  const [username, server] = acct.split('@')
  const url = `https://${server}/api/v1/accounts/lookup?acct=${username}`

  try {
    const response = await axios.get<UserData | MastodonErrorResponse>(url)
    if (isErrorResponse(response.data)) {
      throw new Error(response.data.error)
    }

    return response.data.id
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error({
        message: 'AxiosError during userID lookup',
        errorData: error.response?.data,
        acct,
        server,
        url,
      })
    }
  }
}
