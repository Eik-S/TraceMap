import { css } from '@emotion/react'
import { useEffect, useRef } from 'react'
import { darkPurple } from '../../styles/colors'

interface TweetProps {
  id: string
  cards?: boolean
  onLoaded?: () => void
}

export function Tweet({ id, cards = false, onLoaded = () => null, ...props }: TweetProps) {
  const tweetContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tweetContainer = tweetContainerRef.current
    if (tweetContainer === null || tweetContainer.childNodes.length > 0) {
      return
    }
    window.twttr.ready((twttr) => {
      if (tweetContainer.firstChild) {
        tweetContainer.removeChild(tweetContainer.firstChild)
      }
      twttr.widgets
        .createTweet(id, tweetContainer, {
          cards: cards ? 'visible' : 'hidden',
          linkColor: darkPurple,
          width: 308,
          conversation: 'none',
        })
        .then(onLoaded)
        .catch((error) => {
          console.error(error)
        })
    })

    return () => {
      const firstChildOfTweetContainer = tweetContainer?.firstChild
      if (firstChildOfTweetContainer) {
        tweetContainer.removeChild(firstChildOfTweetContainer)
      }
    }
  }, [cards, id, onLoaded])

  return <div css={styles.tweetContainer} {...props} ref={tweetContainerRef} />
}

const styles = {
  tweetContainer: css`
    & > div {
      box-shadow: 0 1px 1px 0 rgba(36, 41, 51, 0.1), 0 2px 2px 0 rgba(15, 19, 26, 0.1),
        0 2px 4px 0 rgba(15, 19, 26, 0.1);
      border-radius: 12px;
      margin-top: -10px;
      margin-bottom: -10px;
    }
  `,
}
