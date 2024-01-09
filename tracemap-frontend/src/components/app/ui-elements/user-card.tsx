import { css } from '@emotion/react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { darkPurple } from '../../../styles/colors'
import { userCardBoxShadow, userDetailsButtonBoxShadow } from '../../../styles/shadows'
import { User, UserProps } from './user'

export function UserCard({ user, ...props }: UserProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { username: currentUser } = useParams()

  return (
    <div
      css={styles.userCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <User user={user} css={styles.user} />
      <Link
        css={styles.linkButton(isHovered)}
        to={currentUser ? `../${user.acct}` : `${user.acct}`}
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

const styles = {
  userCard: css`
    height: 66px;
    min-width: 330px;
    max-width: 370px;
    background-color: #fff;
    border-radius: 6px;
    text-decoration: none;
    display: grid;
    grid-template-columns: 1fr auto;
    padding-left: 14px;
    column-gap: 12px;
    ${userCardBoxShadow}
  `,
  user: css`
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
}
