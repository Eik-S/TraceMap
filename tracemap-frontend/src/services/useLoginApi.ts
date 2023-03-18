import { SessionNotFoundError } from '../errors'
import { apiUrl } from '../utils/config'

interface ActivateSessionParams {
  state: string
  code: string
  sessionID: string
}

interface CreateSessionResponse {
  authURL: string
  sessionID: string
}

export function useApi() {
  async function createSession(): Promise<CreateSessionResponse> {
    const response = await fetch(`${apiUrl}/login/create-session`)
    return response.json()
  }

  async function activateSession({ state, code, sessionID }: ActivateSessionParams): Promise<void> {
    await fetch(`${apiUrl}/login/activate-session`, {
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
  }

  async function restoreSession(sessionID: string): Promise<string> {
    const response = await fetch(`${apiUrl}/login/restore-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionID,
      }),
    })

    if (response.status === 401) {
      throw new SessionNotFoundError()
    }

    const { username } = await response.json()
    return username
  }

  return {
    createSession,
    activateSession,
    restoreSession,
  }
}
