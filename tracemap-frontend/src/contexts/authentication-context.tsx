import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo } from 'react'
import { useTracemapMastoApi } from '../services/useTracemapMastoApi'
import { UserData } from 'tracemap-api-types'

type LoggedOut = {
  state: 'logged-out'
}

type Loading = {
  state: 'loading'
}

type LoggedIn = {
  state: 'logged-in'
  userData: UserData
}

type LoginState = LoggedOut | Loading | LoggedIn

interface Authentication {
  loginState: LoginState
}

function useAuthentication(): Authentication {
  const { isUsable, verifyAccessToken } = useTracemapMastoApi()

  const { data: accountData, isFetching } = useQuery({
    queryKey: ['loginState'],
    retry: false,
    enabled: isUsable,
    queryFn: verifyAccessToken,
  })

  const loginState: LoginState = useMemo(() => {
    if (isFetching) {
      return { state: 'loading' }
    }
    if (accountData) {
      return { state: 'logged-in', userData: accountData }
    }
    return { state: 'logged-out' }
  }, [isFetching, accountData])

  return {
    loginState,
  }
}

const AuthenticationContext = createContext<Authentication | undefined>(undefined)

export function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const authentication = useAuthentication()

  return (
    <AuthenticationContext.Provider value={authentication}>
      {children}
    </AuthenticationContext.Provider>
  )
}

export function useAuthenticationContext() {
  const context = useContext(AuthenticationContext)
  if (context === undefined) {
    throw new Error('useAuthenticationContext must be used within a AuthenticationProvider')
  }
  return context
}
