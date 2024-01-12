import { css } from '@emotion/react'
import { Status } from 'tracemap-api-types'
import { useAppSettingsContext } from '../../../contexts/app-settings-context'
import { filterBoosts, sortByUserSettings } from '../../../utils/timeline-utils'
import { Timeline } from '../../ui-elements/timeline/timeline'

interface UserTimelineProps {
  content: Status[]
  loading?: boolean
}

export function UserTimeline({ content, loading = false, ...props }: UserTimelineProps) {
  const { sortTimelineBy, showBoosts } = useAppSettingsContext()

  const filteredTimeline = showBoosts ? content : filterBoosts(content)
  const sortedTimeline = sortByUserSettings(filteredTimeline, sortTimelineBy)

  return (
    <div css={styles.userTimelineWrapper}>
      <Timeline content={sortedTimeline} loading={loading} {...props} />
    </div>
  )
}

const styles = {
  userTimelineWrapper: css`
    display: flex;
    justify-content: center;
  `,
}
