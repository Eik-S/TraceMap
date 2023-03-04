import { css } from '@emotion/react'
import { useParams } from 'react-router-dom'
import { Tweet } from '../tweet'

interface SourceTweetProps {
  onLoaded: () => void
}
export function SourceTweet({ onLoaded }: SourceTweetProps) {
  const { tweetId } = useParams()

  if (tweetId) {
    return (
      <div css={styles.wrapper}>
        <Tweet css={styles.tweetContainer} id={tweetId} key="1" onLoaded={onLoaded} />
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
    grid-template-rows: 1fr;
  `,
  tweetContainer: css`
    width: 309px;
  `,
}
