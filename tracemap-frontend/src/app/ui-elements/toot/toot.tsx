import { css } from '@emotion/react'
import { Status } from 'tracemap-api-types'
import {
  colorGrayFontAccent,
  colorGrayFontLight,
  darkPurple,
  lightPurple,
} from '../../../styles/colors'
import { User } from '../user'

interface TootProps {
  status: Status
}

export function Toot({ status, ...props }: TootProps) {
  const date = new Date(status.created_at)

  return (
    <div css={styles.statusWrapper} {...props}>
      <User user={status.account} />
      <div css={styles.content} dangerouslySetInnerHTML={{ __html: status.content }}></div>
      <div css={styles.dateLine}>
        <span>
          {date.toLocaleString('en-EN', { month: 'long' })} {date.getDate()}, {date.getFullYear()}{' '}
          at {date.toLocaleTimeString('en-EN', { timeStyle: 'short' })}
        </span>
        <span>•</span>
        <a
          css={styles.statusLink}
          href={status.url}
          target="_blank"
          rel="noreferrer"
          aria-label="open status on mastodon"
        >
          <img
            alt=""
            srcSet="
              /icons/globe-gray_64.png 4x,
              /icons/globe-gray_32.png 2x,
              /icons/globe-gray_16.png 1x"
            src="/icons/globe-gray_16.png"
          />
          mastodon
        </a>
      </div>
    </div>
  )
}

const styles = {
  statusWrapper: css`
    max-width: 370px;
    padding: 16px 12px;
    height: auto;
    background-color: white;
    border-radius: 5px;
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
  dateLine: css`
    color: ${colorGrayFontLight};
    font-size: 14px;
    display: flex;
    justify-content: space-between;
  `,
  statusLink: css`
    color: inherit;
    text-decoration: none;

    img {
      display: inline-block;
      height: 13px;
      margin-right: 4px;
      margin-bottom: -2px;
    }

    &:hover {
      text-decoration: underline;
    }
  `,
}
