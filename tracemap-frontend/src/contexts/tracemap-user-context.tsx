import { useInfiniteQuery } from '@tanstack/react-query'
import { ReactNode, createContext, useContext } from 'react'
import { useTracemapMastoApi } from '../services/useTracemapMastoApi'
import { UserTimelineBatch } from 'tracemap-api-types'
import { useLocalStorage } from '../utils/use-local-storage'

function useTracemapUser() {
  const { getHomeTimeline } = useTracemapMastoApi()
  const [server] = useLocalStorage('server', '')

  const {
    data: getTimelineResponse,
    fetchNextPage: fetchNextTimelinePage,
    hasNextPage: hasNextTimelinePage,
    isFetching: isFetchingTimeline,
  } = useInfiniteQuery({
    queryKey: ['homeTimeline', server],
    enabled: server !== '',
    getNextPageParam: (lastPage: UserTimelineBatch) => lastPage.nextUrl,
    queryFn: async ({ pageParam = undefined }) => {
      return getHomeTimeline(server, pageParam)
    },
  })

  const homeTimeline = getTimelineResponse?.pages.flatMap((page) => page.data) ?? []

  return {
    homeTimeline,
    hasNextTimelinePage,
    isFetchingTimeline,
    fetchNextTimelinePage,
  }
}

const TracemapUserContext = createContext<ReturnType<typeof useTracemapUser> | undefined>(undefined)

export function TracemapUserProvider({ children }: { children: ReactNode }) {
  const tracemapUser = useTracemapUser()

  return (
    <TracemapUserContext.Provider value={tracemapUser}>{children}</TracemapUserContext.Provider>
  )
}

export function useTracemapUserContext() {
  const context = useContext(TracemapUserContext)
  if (context === undefined) {
    throw new Error('useTracemapUserContext must be used within a TracemapUserProvider')
  }
  return context
}
