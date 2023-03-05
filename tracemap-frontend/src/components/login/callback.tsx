import { useEffect } from 'react'
import { useApi } from '../../services/useLoginApi'

export function Callback() {
  const { activateSession } = useApi()

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const state = urlSearchParams.get('state')
    const code = urlSearchParams.get('code')
    const sessionID = localStorage.getItem('sessionID')

    if (!sessionID || !state || !code) {
      return
    }

    activateSession({ sessionID, state, code })
      .then(() => {
        window.location.href = '/app'
      })
      .catch((error) => {
        console.error(error)
      })
  }, [activateSession])

  return (
    <div>
      <h1>Logging you in...</h1>
    </div>
  )
}
