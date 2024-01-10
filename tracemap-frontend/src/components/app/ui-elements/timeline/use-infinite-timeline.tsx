import { css } from '@emotion/react'
import { CircularProgress } from '@mui/material'
import { ReactNode, UIEvent, useState } from 'react'
import { Status } from 'tracemap-api-types'
import { Timeline } from './timeline'

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

  const InfiniteTimeline =
    (data: Status[]) =>
    ({ children, ...props }: { children?: ReactNode }) =>
      (
        <div css={styles.infiniteTimelineWrapper} {...props}>
          {children}
          <Timeline content={data} />
          {isFetching && <CircularProgress css={styles.loadingSpinner} />}
        </div>
      )

  return {
    InfiniteTimeline: InfiniteTimeline(data),
    fetchMorePostsIfOnBottom,
  }
}

const styles = {
  infiniteTimelineWrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  loadingSpinner: css`
    margin-bottom: 25px;
    align-self: center;
  `,
}
