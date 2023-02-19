import { css } from '@emotion/react'
import { useState } from 'react'
import { useTwitterLogin } from '../services/useTwitterLogin'
import { darkPurple } from '../styles/colors'

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

export function Header() {
  const { tryToRestorePreviousSession } = useTwitterLogin()

  const [loginState, setLoginState] = useState<LoginState>({ state: 'loading' })

  window.onload = () => {
    tryToRestorePreviousSession()
      .then((username) => {
        setLoginState({
          state: 'logged-in',
          username,
        })
      })
      .catch(() => {
        setLoginState({
          state: 'logged-out',
        })
      })
  }

  return (
    <div css={styles.wrapper}>
      <LoginArea loginState={loginState} />
    </div>
  )
}

function LoginArea({ loginState }: { loginState: LoginState }) {
  const { loginWithTwitter } = useTwitterLogin()

  switch (loginState.state) {
    case 'logged-out':
      return (
        <button css={styles.loginButton} onClick={() => loginWithTwitter()}>
          Twitter Login
        </button>
      )
    case 'logged-in':
      return <p css={styles.username}>Hello @{loginState.username}</p>
    default:
      return <p css={styles.loadingText}>loading</p>
  }
}

const styles = {
  wrapper: css`
    height: 150px;
    padding: 0 60px;
    margin: 0;
    background-color: ${darkPurple};
    display: flex;
    place-items: center;
  `,
  loginButton: css`
    border: 8px solid #fff;
    background-color: ${darkPurple};
    padding: 15px 30px;
    color: #fff;
    font-size: 32px;
    font-weight: 800;
    text-align: center;
    cursor: pointer;
  `,
  username: css`
    color: #fff;
    font-size: 32px;
    font-weight: 800;
  `,
  loadingText: css`
    color: #fff;
    font-size: 32px;
    font-weight: 800;
    &:after {
      content: '';
      animation: 1s infinite alternate dots;
    }

    @keyframes dots {
      0% {
        content: '';
      }
      33% {
        content: '.';
      }
      66% {
        content: '..';
      }
      100% {
        content: '...';
      }
    }
  `,
}
