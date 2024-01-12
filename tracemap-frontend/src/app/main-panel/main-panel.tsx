import { css } from '@emotion/react'
import { useStatusInfoContext } from '../../contexts/status-info-context'
import { mainButton } from '../../styles/buttons'
import { colorGrayFontBlackish, colorGrayFontLight, lightPurple } from '../../styles/colors'

export function MainPanel({ ...props }) {
  const { totalFollowers, totalFollowing } = useStatusInfoContext()
  // Calculated by default rate limits of mastodon API:
  //    80 followers/followees per request, 300 request per 5 minutes
  const apiRequests = Math.ceil(totalFollowers / 80)
  const timeEstimated = Math.ceil((apiRequests / 300) * 5)

  return (
    <div css={styles.wrapper} {...props}>
      <div css={styles.infoBox}>
        <div css={styles.labelBox}>
          <label htmlFor="generation-time-estimation">time estimated</label>
          <span id="generation-time-estimation">{timeEstimated} min</span>
        </div>
        <div css={styles.labelBox}>
          <label htmlFor="total-followers">total followers</label>
          <span id="total-followers">{totalFollowers}</span>
        </div>
        <div css={styles.labelBox}>
          <label htmlFor="total-following">total following</label>
          <span id="total-following">{totalFollowing}</span>
        </div>
        <div css={styles.labelBox}>
          <label htmlFor="api-requests">requests (followers)</label>
          <span id="api-requests">{apiRequests}</span>
        </div>
      </div>
      <button css={styles.generateTracemapButton}>generate TraceMap</button>
    </div>
  )
}

const styles = {
  wrapper: css`
    background-color: ${colorGrayFontLight};
    display: flex;
    flex-direction: column;
    gap: 48px;
    place-items: center;
    justify-content: center;
  `,
  infoBox: css`
    background-color: white;
    padding: 24px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px;
  `,
  labelBox: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;

    label {
      font-size: 14px;
      color: ${colorGrayFontBlackish};
      inline-size: min-content;
      text-align: center;
      letter-spacing: 0.03em;
    }

    span {
      font-size: 18px;
      font-weight: bold;
    }
  `,
  generateTracemapButton: css`
    ${mainButton}
    background-color: transparent;

    &:hover {
      background-image: none;
      background-color: ${lightPurple};
    }
  `,
}
