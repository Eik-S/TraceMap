import { css } from '@emotion/react'
import { useEffect } from 'react'
import { UserCard } from '../../ui-elements/user-card'
import { useStatusInfoContext } from '../../../../contexts/status-info-context'

interface RetweetersProps {
  onLoaded: () => void
}

export function SharedByUsers({ onLoaded, ...props }: RetweetersProps) {
  const { rebloggedByUsers } = useStatusInfoContext()

  useEffect(() => {
    if (rebloggedByUsers.length > 0) {
      onLoaded()
    }
  }, [onLoaded, rebloggedByUsers])

  return (
    <div css={styles.userCardList} {...props}>
      {rebloggedByUsers.map((user) => (
        <UserCard key={user.acct} user={user} />
      ))}
    </div>
  )
}

const styles = {
  userCardList: css`
    display: flex;
    flex-direction: column;
    row-gap: 14px;
  `,
}
