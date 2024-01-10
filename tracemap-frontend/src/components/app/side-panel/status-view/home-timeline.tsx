import { useTracemapUserContext } from '../../../../contexts/tracemap-user-context'
import { scrollContainer } from '../../../../styles/utils'
import { useInfiniteTimeline } from '../../ui-elements/use-infinite-timeline'
import { Accordion } from '../accordion'

export function HomeTimeline() {
  const { homeTimeline, fetchNextTimelinePage } = useTracemapUserContext()
  const { infiniteTimeline, fetchMorePostsIfOnBottom } = useInfiniteTimeline({
    data: homeTimeline,
    fetchNextPage: fetchNextTimelinePage,
  })
  const timelineState = homeTimeline.length === 0 ? 'loading' : 'loaded'

  return (
    <div css={scrollContainer} onScroll={fetchMorePostsIfOnBottom}>
      <Accordion title="Your Timeline" contentState={timelineState}>
        {infiniteTimeline}
      </Accordion>
    </div>
  )
}
