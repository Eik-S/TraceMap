import { css } from '@emotion/react'
import { sideGap } from '../styles/utils'
import { Header } from '../header'
import { useAuthenticationContext } from '../contexts/authentication-context'
import { darkPurple } from '../styles/colors'
import { useTracemapLoginApi } from '../apis/useTracemapLoginApi'
import { useLocalStorage } from '../utils/use-local-storage'
import { mainButton } from '../styles/buttons'

export function Home() {
  const { loginState } = useAuthenticationContext()

  return (
    <div css={styles.homepage}>
      <Header></Header>
      <div css={styles.contentWrapper}>
        {loginState.state === 'logged-out' && <LoginArea />}
        {loginState.state === 'logged-in' && <MainNavigation />}
      </div>
      <img css={styles.image} alt="" src="homepage-background-1920.png" />
    </div>
  )
}

function LoginArea() {
  const { loginWithMastodon } = useTracemapLoginApi()
  const [server, setServer] = useLocalStorage('server', '')
  const weakValidServer = server.length > 3 && server.indexOf('.') !== -1

  function loginOnEnterKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && weakValidServer) {
      loginWithMastodon(server)
    }
  }

  return (
    <div css={styles.loginWrapper}>
      <input
        css={styles.serverInput}
        type="text"
        onChange={(event) => setServer(event.target.value)}
        onKeyDown={(event) => loginOnEnterKeyDown(event.nativeEvent)}
        value={server}
        placeholder="your servers hostname (e.g mastodon.social)"
      />
      <button
        css={styles.loginButton}
        onClick={() => loginWithMastodon(server)}
        disabled={weakValidServer === false}
      >
        Mastodon Login
      </button>
    </div>
  )
}

function MainNavigation() {
  return (
    <button css={styles.loginButton} onClick={() => (window.location.href = '/app')}>
      The Tool
    </button>
  )
}

const styles = {
  homepage: css`
    overflow: hidden;
    height: 100vh;
  `,
  image: css`
    width: 100%;
    object-fit: cover;
    padding-right: ${sideGap};
  `,
  contentWrapper: css`
    padding: 48px 0;
    background-color: ${darkPurple};
    display: flex;
    place-items: center;
    justify-content: center;
  `,
  loginWrapper: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 48px;
  `,
  serverInput: css`
    padding: 16px 12px;
    font-size: 22px;
    font-weight: bold;
    width: max-content;
    min-width: 440px;
    text-align: center;
  `,
  loginButton: css`
    ${mainButton}
  `,
}
