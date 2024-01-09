import { css } from '@emotion/react'
import { Status } from '../../../../services/useMastoClientApi'
import { TootCard } from '../../ui-elements/toot/toot-card'

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
    margin: 20px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
}
