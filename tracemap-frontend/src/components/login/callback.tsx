import { useEffect } from 'react'
import { useLocalStorage } from '../../utils/use-local-storage'
import { useTracemapLoginApi } from '../../services/useTracemapLoginApi'

export function Callback() {
  const [server] = useLocalStorage('server', '')
  const { getAccessToken } = useTracemapLoginApi()

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const authorizationCode = urlSearchParams.get('code')

    if (authorizationCode === null || server === '') {
      return
    }

    getAccessToken(server, authorizationCode)
      .then(({ accessToken }) => {
        localStorage.setItem('access-token', accessToken)
        window.location.href = '/app'
      })
      .catch((error) => {
        console.error(error)
      })
  }, [getAccessToken, server])

  return (
    <div>
      <h1>Logging you in...</h1>
    </div>
  )
}
