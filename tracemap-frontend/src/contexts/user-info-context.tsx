import { useInfiniteQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserTimelineBatch, useMastoClientApi } from '../services/useMastoClientApi'
import { useStatusInfoContext } from './status-info-context'

export interface RetweetingUser {
  userID: string
  name: string
  screenName: string
  profileImageUrl?: string
}

function useUserInfo() {
  const { rebloggedByUsers, statusServer } = useStatusInfoContext()
  const { getUserTimeline } = useMastoClientApi()
  const { username } = useParams()
  const userData = rebloggedByUsers.find((user) => user.acct === username)

  const {
    data: getTimelineResponse,
    fetchNextPage: fetchNextTimelinePage,
    hasNextPage: hasNextTimelinePage,
  } = useInfiniteQuery({
    queryKey: ['userTimeline', userData?.id],
    enabled: typeof userData !== 'undefined',
    getNextPageParam: (lastPage: UserTimelineBatch) => lastPage.nextUrl,
    queryFn: async ({ pageParam = undefined }) => {
      return getUserTimeline(statusServer!, userData!.id, pageParam)
    },
  })

  const userTimeline = getTimelineResponse?.pages.flatMap((page) => page.data) ?? []

  return {
    userInfo: userData,
    userTimeline,
    hasNextTimelinePage,
    fetchNextTimelinePage,
  }
}

const UserInfoContext = createContext<ReturnType<typeof useUserInfo> | undefined>(undefined)

export function UserInfoProvider({ children }: { children: React.ReactNode }) {
  const userInfo = useUserInfo()

  return <UserInfoContext.Provider value={userInfo}>{children}</UserInfoContext.Provider>
}

export function useUserInfoContext() {
  const context = useContext(UserInfoContext)
  if (context === undefined) {
    throw new Error('useUserInfoContext must be used within a TwitterApiProvider')
  }
  return context
}
