import { createContext, useContext } from 'react'
import { TweetV2 } from 'twitter-api-v2'
import { apiUrl } from '../../../utils/config'

interface TwitterApi {
  getTweetInfo: (tweetId: string) => Promise<TweetV2>
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

  return {
    getTweetInfo,
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
