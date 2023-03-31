import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { colorParagraph } from '../../../styles/colors'
import { useTweetInfoContext } from '../../../twitter-api/tweet-info-context'
import { Tweet } from '../ui-elements/tweet'

interface SourceTweetProps {
  onLoaded: () => void
}
export function SourceTweet({ onLoaded }: SourceTweetProps) {
  const { tweetID, retweetCount } = useTweetInfoContext()
  const [tweetLoaded, setTweetLoaded] = useState(false)

  useEffect(() => {
    if (tweetLoaded && retweetCount) {
      onLoaded()
    }
  }, [retweetCount, onLoaded, tweetLoaded])

  if (tweetID && retweetCount) {
    return (
      <div css={styles.wrapper}>
        <Tweet css={styles.tweetContainer} id={tweetID} onLoaded={() => setTweetLoaded(true)} />
        <div css={styles.tweetInfo}>
          <img
            css={styles.retweetIcon}
            alt=""
            srcSet="
              /icons/retweet_64.png 4x,
              /icons/retweet_32.png 2x,
              /icons/retweet_16.png 1x"
            src="/icons/retweet_16.png"
          />
          <p css={styles.retweetCount}>{retweetCount}</p>
        </div>
      </div>
    )
  }

  return null
}

const styles = {
  wrapper: css`
    display: grid;
    justify-items: center;
    margin-top: 20px;
    margin-bottom: 30px;
    grid-template-columns: 1fr;
    grid-template-rows: auto 16px;
  `,
  tweetContainer: css`
    width: 309px;
  `,
  tweetInfo: css`
    width: 309px;
    justify-content: center;
    display: grid;
    grid-template-columns: 16px auto;
  `,
  retweetIcon: css`
    width: 100%;
  `,
  retweetCount: css`
    font-size: 11px;
    margin-left: 10px;
    margin-top: 3px;
    color: ${colorParagraph};
    font-weight: 600;
    line-height: 11px;
  `,
}
