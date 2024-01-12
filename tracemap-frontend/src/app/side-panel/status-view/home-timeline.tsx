import { useTracemapUserContext } from '../../../contexts/tracemap-user-context'
import { scrollContainer } from '../../../styles/utils'
import { Timeline } from '../../ui-elements/timeline/timeline'
import { Accordion } from '../accordion'

export function HomeTimeline() {
  const { homeTimeline, fetchNextTimelinePage, isFetchingTimeline } = useTracemapUserContext()
  const timelineState = homeTimeline.length === 0 ? 'loading' : 'loaded'

  function fetchMorePostsIfOnBottom(element: HTMLDivElement) {
    if (isFetchingTimeline) {
      return
    }
    const scrollLeft = element.scrollHeight - (element.scrollTop + element.offsetHeight)
    if (scrollLeft < 300) {
      fetchNextTimelinePage()
    }
  }

  return (
    <div
      css={scrollContainer}
      onScroll={(event) => fetchMorePostsIfOnBottom(event.target as HTMLDivElement)}
    >
      <Accordion title="Your Timeline" contentState={timelineState}>
        <Timeline content={homeTimeline} loading={isFetchingTimeline} />
      </Accordion>
    </div>
  )
}
