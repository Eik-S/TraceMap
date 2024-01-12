import { css } from '@emotion/react'
import {
  colorGrayFontAccent,
  colorGrayFontLight,
  darkPurple,
  lightPurple,
} from '../../../styles/colors'
import { User } from '../user'
import { Status } from 'tracemap-api-types'

interface TootProps {
  status: Status
}

export function Toot({ status, ...props }: TootProps) {
  const date = new Date(status.created_at)

  return (
    <div css={styles.statusWrapper} {...props}>
      <User user={status.account} />
      <div css={styles.content} dangerouslySetInnerHTML={{ __html: status.content }}></div>
      <div css={styles.date}>
        <span>
          {date.toLocaleString('en-EN', { month: 'long' })} {date.getDate()}, {date.getFullYear()}{' '}
          at {date.toLocaleTimeString('en-EN', { timeStyle: 'short' })}
        </span>
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
  date: css`
    color: ${colorGrayFontLight};
    font-size: 14px;
    display: flex;
    justify-content: space-between;
  `,
}
