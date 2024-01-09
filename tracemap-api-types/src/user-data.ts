export interface Emoji {
  shortcode: string
  url: string
}

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
  emojis: Emoji[]
}
