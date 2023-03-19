import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { darkPurple } from '../../../styles/colors'
import { userCardBoxShadow, userDetailsButtonBoxShadow } from '../../../styles/shadows'
import { resetButtonStyles } from '../../../styles/utils'
import { useTwitterApiContext } from '../../../twitter-api/twitterApiContext'
import { User } from '../user'

interface RetweetingUser {
  userID: string
  name: string
  screenName: string
  profileImageUrl?: string
}

interface RetweetersProps {
  tweetID: string
  onLoaded: () => void
}

export function Retweeters({ tweetID, onLoaded, ...props }: RetweetersProps) {
  const { getTweetRetweetedBy } = useTwitterApiContext()
  const [retweetingUsers, setRetweetingUsers] = useState<RetweetingUser[]>([])

  useEffect(() => {
    getTweetRetweetedBy(tweetID).then((response) => {
      setRetweetingUsers(
        response.data.map((user) => ({
          userID: user.id,
          name: user.name,
          screenName: user.username,
          profileImageUrl: user.profile_image_url,
        })),
      )
      onLoaded()
    })
  }, [getTweetRetweetedBy, tweetID, onLoaded])

  return (
    <div css={styles.userCardList} {...props}>
      {retweetingUsers.map((user) => (
        <UserCard key={user.userID} user={user} />
      ))}
    </div>
  )
}

interface UserCardProps {
  user: RetweetingUser
}

function UserCard({ user, ...props }: UserCardProps) {
  const { userID, name, screenName, profileImageUrl } = user
  const [isHovered, setIsHovered] = useState(false)

  function openUserDetails() {
    console.log(`Open user details page for user ${userID} (${name}}`)
    // TODO: Write user details page
  }

  return (
    <div
      css={styles.userCard}
      onClick={() => openUserDetails()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <User
        css={styles.user}
        name={name}
        screenName={screenName}
        profileImageUrl={profileImageUrl}
      />
      <button css={styles.button(isHovered)}>
        {isHovered ? (
          <img
            alt=""
            srcSet="
          /icons/arrow-right-white_128.png 4x,
          /icons/arrow-right-white_64.png 2x,
          /icons/arrow-right-white_32.png 1x
          "
            src="/icons/arrow-right-white_32.png"
          />
        ) : (
          <img
            alt=""
            srcSet="
                /icons/arrow-right_128.png 4x,
                /icons/arrow-right_64.png 2x,
                /icons/arrow-right_32.png 1x
                "
            src="/icons/arrow-right_32.png"
          />
        )}
      </button>
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
  userCard: css`
    height: 66px;
    width: 320px;
    background-color: #fff;
    border-radius: 6px;
    display: flex;
    ${userCardBoxShadow}
  `,
  user: css`
    align-items: center;
    padding-left: 14px;
    width: 272px;
    overflow: hidden;
  `,
  button: (highlighted: boolean) => css`
    ${resetButtonStyles}
    width: 48px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    transition: background-color 0.2s linear;

    img {
      width: 12px;
      opacity: 0.3;
    }

    ${highlighted &&
    css`
      background-color: ${darkPurple};
      transition: background-color 0.2s linear;
      ${userDetailsButtonBoxShadow}

      img {
        opacity: 1;
      }
    `}
  `,
}
