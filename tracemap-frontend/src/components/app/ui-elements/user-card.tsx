import { css } from '@emotion/react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { colorGrayFontBlackish, colorParagraph, darkPurple } from '../../../styles/colors'
import { userCardBoxShadow, userDetailsButtonBoxShadow } from '../../../styles/shadows'
import { UserData } from 'tracemap-api-types'

interface UserCardProps {
  user: UserData
}

export function UserCard({ user, ...props }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { userID } = useParams()

  return (
    <div
      css={styles.userCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <User css={styles.user} {...user} />
      <Link
        css={styles.linkButton(isHovered)}
        to={userID ? `../${user.acct}` : `${user.acct}`}
        relative="path"
      >
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
      </Link>
    </div>
  )
}

export function User({ username, acct, avatar, url, ...props }: UserData) {
  return (
    <div css={styles.wrapper} {...props}>
      <img css={styles.image} alt="" src={avatar} />
      <a
        css={styles.twitterLink}
        href={url}
        target="_blank"
        rel="noreferrer"
        title="view on Mastodon"
      >
        <h3 css={styles.name}>{username}</h3>
        <p css={styles.screenName}>@{acct}</p>
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
    text-decoration: none;
    display: flex;
    ${userCardBoxShadow}
  `,
  user: css`
    align-items: center;
    padding-left: 14px;
    width: 272px;
    overflow: hidden;
  `,
  linkButton: (highlighted: boolean) => css`
    width: 48px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    transition: background-color 0.2s linear;
    display: flex;
    justify-content: center;
    align-items: center;

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
