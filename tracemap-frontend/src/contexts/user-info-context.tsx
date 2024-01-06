import { createContext, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useStatusInfoContext } from './status-info-context'
import { UserTimelineBatch, useMastoClientApi } from '../services/useMastoClientApi'
import { useInfiniteQuery } from '@tanstack/react-query'

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
  const accountData = rebloggedByUsers.find((user) => user.acct === username)

  const {
    data: getTimelineResponse,
    fetchNextPage: fetchNextTimelinePage,
    hasNextPage: hasNextTimelinePage,
  } = useInfiniteQuery({
    queryKey: ['userTimeline', accountData?.id],
    enabled: typeof accountData !== 'undefined',
    getNextPageParam: (lastPage: UserTimelineBatch) => lastPage.nextUrl,
    queryFn: async ({ pageParam = undefined }) => {
      return getUserTimeline(statusServer!, accountData!.id, pageParam)
    },
  })

  const userTimeline = getTimelineResponse?.pages.flatMap((page) => page.data) ?? []

  return {
    userInfo: accountData,
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
