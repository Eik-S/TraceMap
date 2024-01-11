import { css } from '@emotion/react'
import { useAppSettingsContext } from '../../../../contexts/app-settings-context'
import { useUserInfoContext } from '../../../../contexts/user-info-context'
import { filterBoosts, sortByUserSettings } from '../../../../utils/timeline-utils'
import { Timeline } from '../../ui-elements/timeline/timeline'

export function UserTimeline({ ...props }) {
  const { sortTimelineBy, showBoosts } = useAppSettingsContext()
  const { userTimeline, isFetchingTimeline } = useUserInfoContext()

  const filteredTimeline = showBoosts ? userTimeline : filterBoosts(userTimeline)
  const sortedTimeline = sortByUserSettings(filteredTimeline, sortTimelineBy)

  return (
    <div css={styles.userTimelineWrapper}>
      <Timeline content={sortedTimeline} loading={isFetchingTimeline} {...props} />
    </div>
  )
}

const styles = {
  userTimelineWrapper: css`
    display: flex;
    justify-content: center;
  `,
}
