import { TweetV2, TweetV2LikedByResult } from 'twitter-api-v2'
import { apiUrl } from '../utils/config'

export function useTwitterApi() {
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

    if (response.ok) {
      return response.json() as Promise<TweetV2>
    }

    handleTracemapApiErrorResponse(response)
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

    if (response.ok) {
      return response.json() as Promise<TweetV2LikedByResult>
    }

    handleTracemapApiErrorResponse(response)
  }

  function handleTracemapApiErrorResponse(response: Response): never {
    if (response.status === 401 && response.statusText === 'Unauthorized') {
      console.log('handled unauthorized error from tracemap api')
      throw new Error()
    }
    console.log(response)
    throw new Error('unhandled error from tracemap api')
  }

  return {
    getTweetInfo,
    getTweetRetweetedBy,
  }
}
