import axios from 'axios'

export interface UserData {
  username: string
  url: string
  avatar: string
  header: string
  acct: string
  id: string
  following_count: number
  followers_count: number
  statuses_count: number
  note: string
}

export async function verifyAccessToken(server: string, accessToken: string): Promise<UserData> {
  const response = await axios.get(`https://${server}/api/v1/accounts/verify_credentials`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  const {
    username,
    url,
    avatar,
    header,
    acct,
    id,
    followers_count,
    following_count,
    statuses_count,
    note,
  } = response.data
  return {
    username,
    url,
    avatar,
    header,
    acct,
    id,
    followers_count,
    following_count,
    statuses_count,
    note,
  }
}
