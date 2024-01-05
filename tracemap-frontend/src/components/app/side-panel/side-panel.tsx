import { css } from '@emotion/react'
import { useParams } from 'react-router-dom'
import { UserInfoProvider } from '../../../contexts/user-info-context'
import { StatusView } from './status-view/status-view'
import { UserView } from './user-view/user-view'
import { useStatusInfoContext } from '../../../contexts/status-info-context'

export function SidePanel() {
  const { rebloggedByUsers } = useStatusInfoContext()
  const { userID } = useParams()
  const accountData = userID && rebloggedByUsers.find((user) => user.acct === userID)
  return (
    <div css={styles.wrapper}>
      <StatusView />
      {userID && accountData && (
        <UserInfoProvider accountData={accountData}>
          <UserView />
        </UserInfoProvider>
      )}
    </div>
  )
}

const styles = {
  wrapper: css`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    overflow-y: auto;
    overflow-x: hidden;

    & > * {
      grid-column: 1;
      grid-row: 1;
    }
  `,
}
