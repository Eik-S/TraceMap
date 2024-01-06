import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMastoClientApi } from '../services/useMastoClientApi'
import { useTracemapMastoApi } from '../services/useTracemapMastoApi'

function useStatusInfo() {
  const { status } = useParams()
  const [statusID, statusServer] = status ? status.split('@') : [undefined, undefined]
  const { getStatusInfo } = useMastoClientApi()
  const { getRebloggedByUsers } = useTracemapMastoApi()
  const [totalFollowing, setTotalFollowing] = useState(0)
  const [totalFollowers, setTotalFollowers] = useState(0)

  const { data: rebloggedByUsers } = useQuery({
    queryKey: ['statusRebloggedBy', statusID],
    enabled: typeof statusID !== 'undefined' || typeof statusServer !== 'undefined',
    retry: false,
    queryFn: async () => {
      const response = await getRebloggedByUsers(statusID!)
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

  useEffect(() => {
    if (typeof rebloggedByUsers === 'undefined') {
      return
    }
    setTotalFollowers(
      rebloggedByUsers?.map((user) => user.followers_count).reduce((sum, curr) => (sum += curr)) ||
        0,
    )
    setTotalFollowing(
      rebloggedByUsers?.map((user) => user.following_count).reduce((sum, curr) => (sum += curr)) ||
        0,
    )
  }, [rebloggedByUsers])

  return {
    statusInfo,
    statusServer,
    rebloggedByUsers: rebloggedByUsers || [],
    totalFollowing,
    totalFollowers,
  }
}

const StatusInfoContext = createContext<ReturnType<typeof useStatusInfo> | undefined>(undefined)

export function StatusInfoProvider({ children }: { children: React.ReactNode }) {
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
