import axios from 'axios'
import { UserData } from 'tracemap-api-types'

export async function verifyAccessToken(server: string, accessToken: string): Promise<UserData> {
  const response = await axios.get(`https://${server}/api/v1/accounts/verify_credentials`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  return response.data
}
