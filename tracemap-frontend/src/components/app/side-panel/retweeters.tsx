import { css } from '@emotion/react'
import { useEffect } from 'react'
import { useTweetInfoContext } from '../../../twitter-api/tweet-info-context'
import { UserCard } from '../ui-elements/user-card'

interface RetweetersProps {
  onLoaded: () => void
}

export function Retweeters({ onLoaded, ...props }: RetweetersProps) {
  const { retweetingUsers } = useTweetInfoContext()

  useEffect(() => {
    if (retweetingUsers.length > 0) {
      onLoaded()
    }
  }, [onLoaded, retweetingUsers])

  return (
    <div css={styles.userCardList} {...props}>
      {retweetingUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

const styles = {
  userCardList: css`
    margin: 20px 20px 6px;
    display: flex;
    flex-direction: column;
    row-gap: 14px;
  `,
}
