import { ApiError, NoSessionIDFoundError } from '../errors'
import { useApi } from './useApi'

export function useTwitterLogin() {
  const { createSession, restoreSession } = useApi()

  async function loginWithTwitter() {
    try {
      const { sessionID, authURL } = await createSession()

      localStorage.setItem('sessionID', sessionID)

      window.location.href = authURL
    } catch (error) {
      console.error(error)
    }
  }

  async function tryToRestorePreviousSession() {
    const sessionID = localStorage.getItem('sessionID')

    if (typeof sessionID !== 'string') {
      throw new NoSessionIDFoundError()
    }

    const username = restoreSession(sessionID).catch((error) => {
      localStorage.removeItem('sessionID')
      throw new ApiError(error)
    })

    return username
  }

  return {
    loginWithTwitter,
    tryToRestorePreviousSession,
  }
}
