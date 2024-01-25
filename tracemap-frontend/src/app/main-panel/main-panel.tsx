import { css } from '@emotion/react'
import { useTracemapApi } from '../../apis/useTracemapApi'
import { useStatusInfoContext } from '../../contexts/status-info-context'
import { mainButton } from '../../styles/buttons'
import { colorGrayFontBlackish, colorGrayFontLight, lightPurple } from '../../styles/colors'
import { isDev } from '../../utils/config'

export function MainPanel({ ...props }) {
  const { totalFollowers, totalFollowing, accountHandles } = useStatusInfoContext()
  const { sendCrawlRequest, requestUserRelations } = useTracemapApi()
  // Calculated by default rate limits of mastodon API:
  //    80 followers/followees per request, 300 request per 5 minutes
  const apiRequestsFollowers = Math.ceil(totalFollowers / 80)
  const apiRequestsFollowing = Math.ceil(totalFollowing / 80)
  const timeEstimatedFollowers = Math.floor(apiRequestsFollowers / 300) * 5
  const timeEstimatedFollowing = Math.floor(apiRequestsFollowing / 300) * 5

  const tracemapApiDisabled = typeof accountHandles === 'undefined' || isDev === false

  function requestTracemapCrawling() {
    if (tracemapApiDisabled) {
      return
    }

    sendCrawlRequest(accountHandles)
  }

  async function getUserRelations() {
    if (tracemapApiDisabled) {
      return
    }

    const relations = await requestUserRelations(accountHandles)
    console.log(relations)
  }

  return (
    <div css={styles.wrapper} {...props}>
      <div css={styles.infoBox}>
        <div css={styles.labelBox}>
          <label htmlFor="generation-time-estimation">time estimated (followers)</label>
          <span id="generation-time-estimation">{timeEstimatedFollowers} min</span>
        </div>
        <div css={styles.labelBox}>
          <label htmlFor="generation-time-estimation">time estimated (following)</label>
          <span id="generation-time-estimation">{timeEstimatedFollowing} min</span>
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
          <span id="api-requests">{apiRequestsFollowers}</span>
        </div>
        <div css={styles.labelBox}>
          <label htmlFor="api-requests">requests (following)</label>
          <span id="api-requests">{apiRequestsFollowing}</span>
        </div>
      </div>
      <button
        css={styles.generateTracemapButton}
        onClick={() => requestTracemapCrawling()}
        disabled={tracemapApiDisabled}
      >
        generate TraceMap
      </button>
      <button css={mainButton} onClick={() => getUserRelations()} disabled={tracemapApiDisabled}>
        get TraceMap data
      </button>
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
    display: grid;
    grid-template-columns: auto auto;
    grid-auto-rows: auto;
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
