import { createContext, useContext } from 'react'
import { TweetV2, TweetV2LikedByResult } from 'twitter-api-v2'
import { apiUrl } from '../utils/config'

interface TwitterApi {
  getTweetInfo: (tweetId: string) => Promise<TweetV2>
  getTweetRetweetedBy: (tweetId: string) => Promise<TweetV2LikedByResult>
}

function useTwitterApi() {
  const sessionID = new Promise((resolve) => {
    resolve(localStorage.getItem('sessionID'))
  })

  async function getTweetInfo(tweetID: string): Promise<TweetV2> {
    const response = await fetch(`${apiUrl}/twitter/tweet-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: await sessionID,
        tweetID,
      }),
    })

    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to get tweet info')
    }

    return response.json() as Promise<TweetV2>
  }

  async function getTweetRetweetedBy(tweetID: string): Promise<TweetV2LikedByResult> {
    const response = await fetch(`${apiUrl}/twitter/tweet-retweeted-by`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID: await sessionID,
        tweetID,
      }),
    })

    if (!response.ok) {
      console.log(response)
      throw new Error('Failed to get retweeted by info')
    }

    return response.json() as Promise<TweetV2LikedByResult>
  }

  return {
    getTweetInfo,
    getTweetRetweetedBy,
  }
}

const TwitterApiContext = createContext<TwitterApi | undefined>(undefined)

export function TwitterApiProvider({ children }: { children: React.ReactNode }) {
  const twitterApi = useTwitterApi()

  return <TwitterApiContext.Provider value={twitterApi}>{children}</TwitterApiContext.Provider>
}

export function useTwitterApiContext() {
  const context = useContext(TwitterApiContext)
  if (context === undefined) {
    throw new Error('useTwitterApiContext must be used within a TwitterApiProvider')
  }
  return context
}
