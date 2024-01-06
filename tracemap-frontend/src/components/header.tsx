import { css } from '@emotion/react'
import { iconButton, mainButton } from '../styles/buttons'
import { darkPurple } from '../styles/colors'
import { sideGap } from '../styles/utils'
import { useAuthenticationContext } from '../contexts/authentication-context'
import { UserData } from 'tracemap-api-types'

export function Header({ ...props }) {
  const { loginState } = useAuthenticationContext()

  return (
    <div {...props}>
      <div css={styles.logoHeadline}>
        <h1 css={styles.logo}>TraceMap</h1>
        {loginState.state === 'logged-in' && <AccountCard {...loginState.userData} />}
      </div>
    </div>
  )
}

function logout() {
  localStorage.removeItem('access-token')
  document.location.href = '/'
}

function AccountCard({ username, avatar, url }: UserData) {
  return (
    <div css={styles.accountCard}>
      <a href={url} target="_blank" rel="noreferrer" css={styles.username}>
        {username}
      </a>
      <button css={styles.logoutButton} onClick={() => logout()}>
        <img alt="" src="/icons/logout-icon_64.png" />
        logout
      </button>
      <img css={styles.avatarImage} src={avatar} alt="" />
    </div>
  )
}

const styles = {
  logoHeadline: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  logo: css`
    font-size: 28px;
    font-weight: 600;
    color: ${darkPurple};
    letter-spacing: 3px;
    padding-left: ${sideGap};
  `,
  accountCard: css`
    height: 60px;
    padding-right: ${sideGap};

    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-column-gap: 12px;
    align-items: baseline;
    justify-items: right;
  `,
  username: css`
    color: ${darkPurple};
    font-size: 22px;
    font-weight: bold;
  `,
  logoutButton: css`
    ${iconButton}
  `,
  avatarImage: css`
    grid-column: 2;
    grid-row: 1 / span 2;
    height: 60px;
  `,
  loginWrapper: css`
    height: 300px;
    background-color: ${darkPurple};
    display: flex;
    place-items: center;
    justify-content: center;
  `,
  loginButton: css`
    ${mainButton}
  `,
  mainNavigation: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
}
