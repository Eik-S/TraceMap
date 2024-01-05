export interface Emoji {
  shortcode: string
  url: string
}

export interface Account {
  display_name: string
  acct: string
  url: string
  avatar: string
  emojis: Emoji[]
}

export interface Status {
  id: string
  created_at: string
  url: string
  reblogs_count: number
  content: string
  account: Account
}

export function useMastoClientApi() {
  async function getStatusInfo(server: string, id: string): Promise<Status> {
    const response = await fetch(`https://${server}/api/v1/statuses/${id}`)
    return await response.json()
  }

  return {
    getStatusInfo,
  }
}
