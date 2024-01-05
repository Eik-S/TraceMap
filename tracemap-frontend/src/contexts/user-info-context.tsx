import { createContext, useContext } from 'react'
import { AccountData } from '../services/useTracemapMastoApi'

export interface RetweetingUser {
  userID: string
  name: string
  screenName: string
  profileImageUrl?: string
}

function useUserInfo(accountData: AccountData) {
  // const { data: userInfo } = useQuery({
  //   queryKey: ['userInfo', userID],
  //   enabled: typeof userID !== 'undefined',
  //   queryFn: async () => {
  //     const response = await getUserInfo(userID!)
  //     return response
  //   },
  // })

  // const {
  //   data: getTimelineResponse,
  //   fetchNextPage,
  //   hasNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ['userTimeline', userID],
  //   enabled: typeof userID !== 'undefined',
  //   getNextPageParam: (lastPage: TweetV2PaginableTimelineResult) => lastPage.meta.next_token,
  //   queryFn: async ({ pageParam = undefined }) => {
  //     const response = await getUserTimeline(userID!, pageParam)
  //     return response
  //   },
  // })

  // const userTimeline = getTimelineResponse?.pages.flatMap((page) => page.data) ?? []

  return {
    userInfo: accountData,
    userTimeline: {},
    hasNextTimelinePage: true,
    fetchNextTimelinePage: () => null,
  }
}

const UserInfoContext = createContext<ReturnType<typeof useUserInfo> | undefined>(undefined)

export function UserInfoProvider({
  accountData,
  children,
}: {
  accountData: AccountData
  children: React.ReactNode
}) {
  const userInfo = useUserInfo(accountData)

  return <UserInfoContext.Provider value={userInfo}>{children}</UserInfoContext.Provider>
}

export function useUserInfoContext() {
  const context = useContext(UserInfoContext)
  if (context === undefined) {
    throw new Error('useUserInfoContext must be used within a TwitterApiProvider')
  }
  return context
}
