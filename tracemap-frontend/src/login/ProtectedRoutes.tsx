import { ReactElement, useEffect } from 'react'
import { useAuthenticationContext } from '../contexts/authentication-context'

export function ProtectedRoute({ children }: { children: ReactElement }): ReactElement {
  const { loginState } = useAuthenticationContext()

  useEffect(() => {
    if (loginState.state === 'logged-out') {
      window.location.href = '/'
    }
  }, [loginState.state])

  return children
}
