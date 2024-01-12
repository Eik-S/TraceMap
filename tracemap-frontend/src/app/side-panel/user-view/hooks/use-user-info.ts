import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { UserTimelineBatch } from 'tracemap-api-types'
import { useMastoClientApi } from '../../../../apis/useMastoClientApi'
import { useStatusInfoContext } from '../../../../contexts/status-info-context'

export function useUserInfo() {
  const { username } = useParams()
  const { rebloggedByUsers, statusServer } = useStatusInfoContext()
  const { getUserTimeline } = useMastoClientApi()
  const userData = username ? rebloggedByUsers.find((user) => user.acct === username) : undefined

  const {
    data: timelineResponses,
    fetchNextPage: fetchNextTimelinePage,
    hasNextPage: hasNextTimelinePage,
    isFetching: isFetchingTimeline,
  } = useInfiniteQuery({
    queryKey: ['userTimeline', userData?.id],
    enabled: typeof userData !== 'undefined',
    getNextPageParam: (lastPage: UserTimelineBatch) => lastPage.nextUrl,
    queryFn: async ({ pageParam = undefined }) => {
      return getUserTimeline(statusServer!, userData!.id, pageParam)
    },
  })

  const userTimeline = timelineResponses?.pages.flatMap((page) => page.data) ?? []

  return {
    userInfo: userData,
    userTimeline,
    hasNextTimelinePage: typeof hasNextTimelinePage === 'undefined' ? true : hasNextTimelinePage,
    isFetchingTimeline,
    fetchNextTimelinePage,
  }
}
