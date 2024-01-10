import { css } from '@emotion/react'
import { CircularProgress } from '@mui/material'
import { ReactNode, UIEvent, useState } from 'react'
import { Status } from 'tracemap-api-types'
import { Timeline } from '../side-panel/user-view/timeline'

interface InfiniteTimelineProps {
  data: Status[]
  fetchNextPage: () => Promise<unknown>
  children?: ReactNode
}

export function useInfiniteTimeline({ data, fetchNextPage }: InfiniteTimelineProps) {
  const [isFetching, setIsFetching] = useState(false)

  async function fetchMorePostsIfOnBottom(event: UIEvent) {
    const element = event.target as HTMLElement
    if (isFetching) {
      return
    }
    const scrollLeft = element.scrollHeight - (element.scrollTop + element.offsetHeight)
    if (scrollLeft < 300) {
      setIsFetching(true)
      void (await fetchNextPage())
      setIsFetching(false)
    }
  }
  const timeline = (
    <div css={styles.timelineWrapper}>
      <Timeline content={data} />
      {isFetching && <CircularProgress css={styles.loadingSpinner} />}
    </div>
  )

  return {
    infiniteTimeline: timeline,
    fetchMorePostsIfOnBottom,
  }
}

const styles = {
  timelineWrapper: css`
    display: flex;
    flex-direction: column;
  `,
  loadingSpinner: css`
    margin-bottom: 25px;
    align-self: center;
  `,
}
