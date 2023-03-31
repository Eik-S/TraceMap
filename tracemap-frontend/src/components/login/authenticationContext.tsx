import { useQuery } from '@tanstack/react-query'
import { createContext, useContext, useMemo } from 'react'
import { useTwitterLogin } from '../../services/useTwitterLogin'

type LoggedOut = {
  state: 'logged-out'
}

type Loading = {
  state: 'loading'
}

type LoggedIn = {
  state: 'logged-in'
  username: string
}

type LoginState = LoggedOut | Loading | LoggedIn

interface Authentication {
  loginState: LoginState
}

function useAuthentication(): Authentication {
  const { tryToRestorePreviousSession } = useTwitterLogin()

  const {
    data: username,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['loginState'],
    enabled: !window.location.href.includes('callback'),
    queryFn: async () => {
      const username = await tryToRestorePreviousSession()
      return username
    },
  })

  const loginState: LoginState = useMemo(() => {
    if (isLoading) {
      return { state: 'loading' }
    }
    if (error) {
      return { state: 'logged-out' }
    }
    return { state: 'logged-in', username: username! }
  }, [error, isLoading, username])

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
