import { css } from '@emotion/react'
import { useState } from 'react'
import { UserInfoProvider } from '../../../contexts/user-info-context'
import { mediaQuery } from '../../../styles/utils'
import { ControlBar } from './control-bar'
import { StatusView } from './status-view/status-view'
import { UserView } from './user-view/user-view'

export function SidePanel({ ...props }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div css={styles.wrapper(isOpen)} {...props}>
      <StatusView css={styles.statusView}>
        <ControlBar onToggleOpenState={setIsOpen} />
      </StatusView>
      <UserInfoProvider>
        <UserView css={styles.userView} />
      </UserInfoProvider>
    </div>
  )
}

const styles = {
  wrapper: (isOpen: boolean) => css`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;

    ${mediaQuery.mobile} {
      transition: margin 0.2s linear;
      width: 100vw;
      ${isOpen === false &&
      css`
        margin-left: -100vw;
      `}
    }
  `,
  statusView: css`
    grid-column: 1;
    grid-row: 1;
  `,
  userView: css`
    grid-column: 1;
    grid-row: 1;
  `,
}
