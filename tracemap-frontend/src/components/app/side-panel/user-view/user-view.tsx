import { css } from '@emotion/react'
import { useUserInfoContext } from '../../../../contexts/user-info-context'

export function UserView() {
  const { userInfo } = useUserInfoContext()

  return (
    <div css={styles.wrapper}>
      <h1>{userInfo.username}</h1>
      <h2>{userInfo.acct}</h2>
    </div>
  )
}

const styles = {
  wrapper: css`
    z-index: 4;
    background-color: green;
  `,
}
