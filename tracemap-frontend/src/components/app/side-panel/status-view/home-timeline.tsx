import { useTracemapUserContext } from '../../../../contexts/tracemap-user-context'
import { scrollContainer } from '../../../../styles/utils'
import { Accordion } from '../accordion'
import { Timeline } from '../user-view/timeline'

export function HomeTimeline() {
  const { homeTimeline } = useTracemapUserContext()
  const timelineState = homeTimeline.length === 0 ? 'loading' : 'loaded'

  return (
    <div css={scrollContainer}>
      <Accordion title="Your Timeline" contentState={timelineState}>
        <Timeline content={homeTimeline} />
      </Accordion>
    </div>
  )
}
