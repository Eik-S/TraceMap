import { useRouter } from 'next/router'
import { CreateSessionResponse } from '../api/login/create-session'

export default function Login() {
  const router = useRouter()

  async function loginWithTwitter() {
    try {
      const response = await fetch('/api/login/create-session')
      const { sessionID, authURL }: CreateSessionResponse = await response.json()

      localStorage.setItem('sessionID', sessionID)

      router.push(authURL)
    } catch (error) {
      console.error(error)
    }
  }

  return <button onClick={() => loginWithTwitter()}>Login with Twitter</button>
}
