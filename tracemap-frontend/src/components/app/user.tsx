import { css } from '@emotion/react'
import { colorGrayFontBlackish, colorParagraph, darkPurple } from '../../styles/colors'

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
