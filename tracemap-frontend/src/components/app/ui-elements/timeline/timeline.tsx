import { css } from '@emotion/react'
import { TootCard } from '../toot/toot-card'
import { Status } from 'tracemap-api-types'
import { CircularProgress } from '@mui/material'

interface TimelineProps {
  content: Status[]
  loading?: boolean
}

export function Timeline({ content, loading, ...props }: TimelineProps) {
  return (
    <div css={styles.timelineWrapper} {...props}>
      {content.map((status) => (
        <TootCard status={status} key={status.id} />
      ))}
      {loading && <CircularProgress css={styles.loadingSpinner} />}
    </div>
  )
}

const styles = {
  timelineWrapper: css`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    gap: 12px;
  `,
  loadingSpinner: css`
    align-self: center;
  `,
}
