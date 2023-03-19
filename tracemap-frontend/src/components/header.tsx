import { css } from '@emotion/react'
import { useTwitterLogin } from '../services/useTwitterLogin'
import { darkPurple, lightPurple } from '../styles/colors'
import { sideGap } from '../styles/utils'
import { useAuthenticationContext } from './login/authenticationContext'

export function Header() {
  return (
    <div>
      <h1 css={styles.logoHeadline}>TraceMap</h1>
      <div css={styles.loginWrapper}>
        <LoginArea />
      </div>
    </div>
  )
}

function LoginArea() {
  const { loginState } = useAuthenticationContext()
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
  logoHeadline: css`
    font-size: 28px;
    font-weight: 600;
    color: ${darkPurple};
    letter-spacing: 3px;
    padding-left: ${sideGap};
  `,
  loginWrapper: css`
    height: 300px;
    background-color: ${darkPurple};
    display: flex;
    place-items: center;
    justify-content: center;
  `,
  loginButton: css`
    border: 8px solid #fff;
    background-color: ${darkPurple};
    padding: 15px 30px;
    color: #fff;
    font-size: 32px;
    font-weight: 800;
    cursor: pointer;
    transition: background-color 0.4s ease-in-out;

    &:hover {
      background-image: radial-gradient(${lightPurple}, ${darkPurple});
    }
  `,
  username: css`
    color: #fff;
    font-size: 32px;
    font-weight: bold;
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
