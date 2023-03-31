import { css } from '@emotion/react'
import { useState } from 'react'
import { UserV2 } from 'twitter-api-v2'
import { colorGrayFontBlackish, colorParagraph, darkPurple } from '../../../styles/colors'
import { userCardBoxShadow, userDetailsButtonBoxShadow } from '../../../styles/shadows'
import { resetButtonStyles } from '../../../styles/utils'

interface UserCardProps {
  user: UserV2
}

export function UserCard({ user, ...props }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  function openUserDetails() {
    console.log(`Open user details page for user ${user.id} (${user.name}}`)
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
        name={user.name}
        screenName={user.username}
        profileImageUrl={user.profile_image_url}
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

interface UserProps {
  name: string
  screenName: string
  profileImageUrl?: string
}

export function User({ name, screenName, profileImageUrl, ...props }: UserProps) {
  return (
    <div css={styles.wrapper} {...props}>
      <img css={styles.image} alt="" src={profileImageUrl || ''} />
      <a
        css={styles.twitterLink}
        href={`https://twitter.com/${screenName}`}
        target="_blank"
        rel="noreferrer"
        title="view on Twitter"
      >
        <h3 css={styles.name}>{name}</h3>
        <p css={styles.screenName}>@{screenName}</p>
      </a>
    </div>
  )
}

const styles = {
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
  wrapper: css`
    display: flex;
    column-gap: 12px;
  `,
  image: css`
    width: 44px;
    height: 44px;
    border-radius: 50%;
  `,
  twitterLink: css`
    text-decoration: none;
  `,
  name: css`
    line-height: 19px;
    font-size: 14px;
    margin: 0;
    font-weight: bold;
    white-space: nowrap;
    color: ${colorGrayFontBlackish};
    &:hover {
      color: ${darkPurple};
    }
  `,
  screenName: css`
    line-height: 19px;
    font-size: 14px;
    margin: 0;
    color: ${colorParagraph};
    white-space: nowrap;
  `,
}
