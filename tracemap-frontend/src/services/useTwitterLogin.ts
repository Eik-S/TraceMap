import { ApiError, NoSessionIDFoundError, SessionNotFoundError } from '../errors'
import { useApi } from './useLoginApi'

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

  async function tryToRestorePreviousSession(): Promise<string> {
    const sessionID = localStorage.getItem('sessionID')

    if (typeof sessionID !== 'string') {
      throw new NoSessionIDFoundError()
    }

    const username = restoreSession(sessionID).catch((error) => {
      switch ((error as Error).constructor) {
        case SessionNotFoundError:
          console.log('removing sessionID')
          localStorage.removeItem('sessionID')
          throw new Error()
        default:
          throw new ApiError(error)
      }
    })

    return username
  }

  return {
    loginWithTwitter,
    tryToRestorePreviousSession,
  }
}
