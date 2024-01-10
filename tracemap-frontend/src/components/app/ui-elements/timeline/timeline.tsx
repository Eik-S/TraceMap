import { css } from '@emotion/react'
import { TootCard } from '../toot/toot-card'
import { Status } from 'tracemap-api-types'

interface TimelineProps {
  content: Status[]
}

export function Timeline({ content }: TimelineProps) {
  return (
    <div css={styles.timelineWrapper}>
      {content.map((status) => (
        <TootCard status={status} key={status.id} />
      ))}
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
}
