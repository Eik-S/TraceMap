import { css } from '@emotion/react'
import { Fragment } from 'react'
import { colorGrayFontDark, darkPurple } from '../../../../styles/colors'
import { NumericMetric } from './numeric-metric'
import { UserData } from 'tracemap-api-types'

export function UserInfo({ userInfo }: { userInfo: UserData }) {
  return (
    <Fragment>
      <div css={styles.userDetails}>
        <div css={styles.userDescription} dangerouslySetInnerHTML={{ __html: userInfo.note }} />
        <div css={styles.userMetrics}>
          <NumericMetric label="Toots" value={userInfo.statuses_count} />
          <NumericMetric label="Followers" value={userInfo.followers_count} />
          <NumericMetric label="Following" value={userInfo.following_count} />
        </div>
      </div>
    </Fragment>
  )
}

const styles = {
  userDetails: css`
    padding: 20px 20px 22px;
    background-color: white;
  `,
  userDescription: css`
    padding-bottom: 15px;

    p {
      font-size: 14px;
      color: ${colorGrayFontDark};
      line-height: 20px;
      padding-bottom: 15px;
      margin: 0;

      &:last-of-type {
        padding-bottom: 0;
      }
    }

    a {
      text-decoration: none;
      color: ${darkPurple};
      &:hover {
        border-bottom: 1px solid ${darkPurple};
      }
    }
  `,
  userMetrics: css`
    display: flex;
    justify-content: space-around;
    background-color: white;
  `,
}
