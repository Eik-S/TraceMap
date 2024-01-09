import { UserData } from './user-data'

export interface PreviewCard {
  url: string
  title: string
  description: string
  type: 'link' | 'photo' | 'video'
  image: string
}

export interface Status {
  id: string
  created_at: string
  url: string
  reblogs_count: number
  content: string
  account: UserData
  reblog: Status | null
  card: PreviewCard | null
}

export interface UserTimelineBatch {
  data: Status[]
  nextUrl?: string
}
