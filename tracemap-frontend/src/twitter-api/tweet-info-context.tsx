import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserV2 } from 'twitter-api-v2'
import { useTwitterApi } from '../services/useTwitterApi'

export interface RetweetingUser {
  userID: string
  name: string
  screenName: string
  profileImageUrl?: string
}

interface TweetInfo {
  tweetID?: string
  retweetCount?: number
  retweetingUsers: UserV2[]
}

function useTweetInfo() {
  const { tweetID } = useParams()
  const { getTweetRetweetedBy, getTweetInfo } = useTwitterApi()

  const { data: retweetingUsers } = useQuery({
    queryKey: ['tweetRetweetedBy', tweetID],
    enabled: typeof tweetID !== 'undefined',
    queryFn: async () => {
      const response = await getTweetRetweetedBy(tweetID!)
      return response.data
    },
  })

  const { data: tweetInfo } = useQuery({
    queryKey: ['tweetInfo', tweetID],
    enabled: typeof tweetID !== 'undefined',
    queryFn: async () => {
      const response = await getTweetInfo(tweetID!)
      return response
    },
  })

  const retweetCount = tweetInfo?.public_metrics?.retweet_count

  return {
    tweetID,
    retweetingUsers: retweetingUsers ?? [],
    retweetCount,
  }
}

const TweetInfoContext = createContext<TweetInfo | undefined>(undefined)

export function TweetInfoProvider({ children }: { children: React.ReactNode }) {
  const twitterApi = useTweetInfo()

  return <TweetInfoContext.Provider value={twitterApi}>{children}</TweetInfoContext.Provider>
}

export function useTweetInfoContext() {
  const context = useContext(TweetInfoContext)
  if (context === undefined) {
    throw new Error('useTweetInfoContext must be used within a TwitterApiProvider')
  }
  return context
}
