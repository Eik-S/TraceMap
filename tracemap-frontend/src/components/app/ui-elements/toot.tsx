import { css } from '@emotion/react'
import { Emoji, Status } from '../../../services/useMastoClientApi'
import {
  colorGrayFontAccent,
  colorGrayFontDark,
  colorGrayFontLight,
  colorParagraph,
  darkPurple,
  lightPurple,
} from '../../../styles/colors'

interface TootProps {
  status: Status
}

export function Toot({ status }: TootProps) {
  const date = new Date(status.created_at)

  return (
    <div>
      <div css={styles.card}>
        <a css={styles.accountInfo} href={status.account.url} target="_blank" rel="noreferrer">
          <img css={styles.avatar} src={status.account.avatar} alt="" />
          <span className="displayName" css={styles.displayName}>
            {removeCustomEmojis(status.account.display_name, status.account.emojis)}
          </span>
          <span css={styles.acct}>@{status.account.acct}</span>
        </a>
        <div css={styles.content} dangerouslySetInnerHTML={{ __html: status.content }}></div>
        <div css={styles.date}>
          <span>
            {date.toLocaleString('default', { month: 'long' })} {date.getDay()},{' '}
            {date.getFullYear()} at {date.toLocaleTimeString('en-EN', { timeStyle: 'short' })}
          </span>
          <div css={styles.statusInfo}>
            <img
              css={styles.shareIcon}
              alt=""
              srcSet="
              /icons/share_64.png 4x,
              /icons/share_32.png 2x,
              /icons/share_16.png 1x"
              src="/icons/share_16.png"
            />
            <p css={styles.shareCounter}>{status.reblogs_count}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const shortenToFit = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const styles = {
  card: css`
    width: 320px;
    padding: 16px 12px;
    height: auto;
    background-color: white;
    border-radius: 5px;
  `,
  accountInfo: css`
    text-decoration: none;
    font-size: 15px;
    display: grid;
    grid-template-columns: 48px 1fr;
    grid-template-rows: auto auto;
    column-gap: 10px;

    &:hover {
      .displayName {
        text-decoration: underline;
      }
    }
  `,
  avatar: css`
    grid-row: 1 / span 2;
    width: 48px;
    height: 48px;
  `,
  displayName: css`
    font-weight: bold;
    font-size: 15px;
    color: ${darkPurple};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    ${shortenToFit}
  `,
  acct: css`
    color: ${colorGrayFontDark};
    ${shortenToFit}
  `,
  content: css`
    font-size: 16px;
    color: ${colorGrayFontAccent};
    overflow: hidden;

    p {
      margin-bottom: 12px;
    }

    a {
      color: ${darkPurple};
      text-decoration: none;

      &:visited {
        color: ${lightPurple};
      }

      &.mention.u-url {
        text-decoration: underline;
      }

      > .invisible {
        display: none;
      }

      > .ellipsis {
        &::after {
          content: '...';
        }
      }
    }
  `,
  date: css`
    color: ${colorGrayFontLight};
    font-size: 14px;
    display: flex;
    justify-content: space-between;
  `,
  statusInfo: css`
    justify-content: center;
    display: grid;
    grid-template-columns: 16px auto;
  `,
  shareIcon: css`
    width: 100%;
    padding-top: 1px;
  `,
  shareCounter: css`
    font-size: 14px;
    margin-left: 10px;
    margin-top: 3px;
    color: ${colorParagraph};
    font-weight: 600;
    line-height: 11px;
  `,
}

function removeCustomEmojis(text: string, emojis: Emoji[]) {
  let newText = text
  emojis.forEach((emoji) => {
    const shortcode = emoji.shortcode
    newText = newText.replace(`:${shortcode}:`, '')
  })

  return newText
}
