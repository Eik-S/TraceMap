import { css } from '@emotion/react'
import { UserInfoProvider } from '../../../contexts/user-info-context'
import { StatusView } from './status-view/status-view'
import { UserView } from './user-view/user-view'

export function SidePanel() {
  return (
    <div css={styles.wrapper}>
      <StatusView />
      <UserInfoProvider>
        <UserView />
      </UserInfoProvider>
    </div>
  )
}

const styles = {
  wrapper: css`
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;

    & > * {
      grid-column: 1;
      grid-row: 1;
    }
  `,
}
