import { css } from '@emotion/react'
import { UserData } from 'tracemap-api-types'
import { colorGrayFontBlackish, colorParagraph, darkPurple } from '../../../styles/colors'
import { TextWithCustomEmojis } from './text-with-custom-emojis'

export interface UserProps {
  user: UserData
}

export function User({ user, ...props }: UserProps) {
  const { avatar, url, display_name, acct } = user

  return (
    <a
      css={styles.wrapper}
      href={url}
      target="_blank"
      rel="noreferrer"
      title="view on Mastodon"
      {...props}
    >
      <img css={styles.image} alt="" src={avatar} />
      <h3 css={styles.name}>
        <TextWithCustomEmojis emojis={user.emojis} input={display_name} />
      </h3>
      <span css={styles.screenName}>@{acct}</span>
    </a>
  )
}

const singleLined = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const styles = {
  wrapper: css`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr 1fr;
    column-gap: 12px;
    overflow: hidden;
    align-items: center;
    text-decoration: none;
    overflow: hidden;

    &:hover {
      h3 {
        color: ${darkPurple};
      }
    }
  `,
  image: css`
    grid-column: 1;
    grid-row: 1 / span 2;
    width: 44px;
    height: 44px;
    border-radius: 50%;
  `,
  name: css`
    font-size: 14px;
    margin: 0;
    color: ${colorGrayFontBlackish};
    font-weight: bold;
    align-self: flex-end;
    ${singleLined}
  `,
  screenName: css`
    font-size: 14px;
    color: ${colorParagraph};
    align-self: flex-start;
    ${singleLined}
  `,
}
