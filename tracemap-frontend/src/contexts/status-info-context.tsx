import { useQuery } from '@tanstack/react-query'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMastoClientApi } from '../apis/useMastoClientApi'
import { useTracemapMastoApi } from '../apis/useTracemapMastoApi'

function useStatusInfo() {
  const { status } = useParams()
  const [statusID, statusServer] = status ? status.split('@') : [undefined, undefined]
  const { getStatusInfo } = useMastoClientApi()
  const { getRebloggedByUsers } = useTracemapMastoApi()
  const [totalFollowing, setTotalFollowing] = useState(0)
  const [totalFollowers, setTotalFollowers] = useState(0)
  const [accountHandles, setAccountHandles] = useState<string[] | undefined>(undefined)

  const { data: rebloggedByUsers } = useQuery({
    queryKey: ['statusRebloggedBy', statusID],
    enabled: typeof statusID !== 'undefined' || typeof statusServer !== 'undefined',
    retry: false,
    queryFn: async () => {
      const response = await getRebloggedByUsers(statusServer!, statusID!)
      return response
    },
  })

  const { data: statusInfo } = useQuery({
    queryKey: ['statusInfo', statusID],
    enabled: typeof statusID !== 'undefined' || typeof statusServer !== 'undefined',
    queryFn: async () => {
      const response = await getStatusInfo(statusServer!, statusID!)
      return response
    },
  })

  // set accountHandles of all users to crawl on tracemap creation
  // format <username>@<server>
  useEffect(() => {
    if (
      typeof rebloggedByUsers === 'undefined' ||
      typeof statusInfo === 'undefined' ||
      typeof statusServer === 'undefined'
    ) {
      return
    }
    const rebloggedByHandles = rebloggedByUsers.map((user) => {
      const acct = user.acct
      if (acct.split('@').length === 2) {
        return acct
      }
      const statusServer = new URL(statusInfo.url).hostname
      return `${acct}@${statusServer}`
    })
    const statusCreatorHandle = `${statusInfo.account.username}@${statusServer}`
    setAccountHandles([statusCreatorHandle, ...rebloggedByHandles])
    console.log(rebloggedByHandles)
  }, [rebloggedByUsers, statusInfo, statusServer])

  // set metrics for approximate crawling duration
  useEffect(() => {
    if (typeof rebloggedByUsers === 'undefined' || typeof statusInfo === 'undefined') {
      return
    }

    const rebloggersFollowers =
      rebloggedByUsers
        ?.map((user) => user.followers_count)
        .reduce((sum, curr) => (sum += curr), 0) || 0
    const sourceFollowers = statusInfo.account.followers_count
    setTotalFollowers(rebloggersFollowers + sourceFollowers)

    const rebloggersFollowing =
      rebloggedByUsers
        ?.map((user) => user.following_count)
        .reduce((sum, curr) => (sum += curr), 0) || 0
    const sourceFollowing = statusInfo.account.following_count
    setTotalFollowing(rebloggersFollowing + sourceFollowing)
  }, [rebloggedByUsers, statusInfo])

  return {
    statusInfo,
    statusServer,
    rebloggedByUsers: rebloggedByUsers || [],
    totalFollowing,
    totalFollowers,
    accountHandles,
  }
}

const StatusInfoContext = createContext<ReturnType<typeof useStatusInfo> | undefined>(undefined)

export function StatusInfoProvider({ children }: { children: ReactNode }) {
  const statusInfo = useStatusInfo()

  return <StatusInfoContext.Provider value={statusInfo}>{children}</StatusInfoContext.Provider>
}

export function useStatusInfoContext() {
  const context = useContext(StatusInfoContext)
  if (context === undefined) {
    throw new Error('useStatusInfoContext must be used within a StatusInfoProvider')
  }
  return context
}
