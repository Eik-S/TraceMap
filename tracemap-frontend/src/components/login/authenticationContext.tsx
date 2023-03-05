import { createContext, useContext, useEffect, useState } from 'react'
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
  const [loginState, setLoginState] = useState<LoginState>({ state: 'loading' })

  useEffect(() => {
    if (window.location.href.includes('callback') || loginState.state !== 'loading') {
      return
    }

    console.log('checking for previous session')
    tryToRestorePreviousSession()
      .then((username) => {
        setLoginState({
          state: 'logged-in',
          username,
        })
      })
      .catch(() => {
        console.log('setting logged out')
        setLoginState({
          state: 'logged-out',
        })
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState.state])

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
