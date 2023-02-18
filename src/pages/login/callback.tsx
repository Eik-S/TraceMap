import { useEffect } from 'react'

export default function Callback() {
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const state = urlSearchParams.get('state')
    const code = urlSearchParams.get('code')
    const sessionID = localStorage.getItem('sessionID')

    fetch('/api/login/activate-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state,
        code,
        sessionID,
      }),
    })
  }, [])

  return (
    <div>
      <h1>Logging you in...</h1>
    </div>
  )
}
