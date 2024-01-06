import { css } from '@emotion/react'
import { Status } from '../../../../services/useMastoClientApi'
import { Toot } from '../../ui-elements/toot'

interface TimelineProps {
  content: Status[]
  fetchNextTimelinePage: () => void
}

export function Timeline({ content, fetchNextTimelinePage }: TimelineProps) {
  return (
    <div css={styles.timelineWrapper}>
      {content.map((status) => (
        <Toot status={status} key={status.id} />
      ))}
    </div>
  )
}

const styles = {
  timelineWrapper: css`
    margin: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
}
