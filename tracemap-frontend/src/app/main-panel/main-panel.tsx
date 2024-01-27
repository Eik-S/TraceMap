import { css } from '@emotion/react'
import { useTracemapApi } from '../../apis/useTracemapApi'
import { useStatusInfoContext } from '../../contexts/status-info-context'
import { mainButton } from '../../styles/buttons'
import {
  colorGrayFontBlackish,
  colorGrayFontLight,
  darkPurple,
  lightPurple,
} from '../../styles/colors'
import { isDev } from '../../utils/config'
import { useEffect, useState } from 'react'

export function MainPanel({ ...props }) {
  const { totalFollowers, totalFollowing, accountHandles, rebloggedByUsers, buildHandle } =
    useStatusInfoContext()
  const { sendCrawlRequest, requestUserRelations, getCrawlStatus } = useTracemapApi()
  const [isCrawling, setIsCrawling] = useState(false)
  const [percentageCrawled, setPercentageCrawled] = useState(0)
  // Calculated by default rate limits of mastodon API:
  //    80 followers/followees per request, 300 request per 5 minutes
  const apiRequestsFollowers = Math.ceil(totalFollowers / 80)
  const apiRequestsFollowing = Math.ceil(totalFollowing / 80)
  const timeEstimatedFollowers = Math.floor(apiRequestsFollowers / 300) * 5
  const timeEstimatedFollowing = Math.floor(apiRequestsFollowing / 300) * 5

  const tracemapApiDisabled = typeof accountHandles === 'undefined' || isDev === false

  useEffect(() => {
    if (tracemapApiDisabled || isCrawling === false) {
      return
    }

    const crawlingStatusInterval = setInterval(async (): Promise<void> => {
      const crawlStatus = await getCrawlStatus(accountHandles)

      if (crawlStatus.handlesCrawled.length === accountHandles.length) {
        setPercentageCrawled(100)
        setIsCrawling(false)
        clearInterval(crawlingStatusInterval)
      }

      const followeesCrawled = rebloggedByUsers
        .filter((user) => crawlStatus.handlesCrawled.includes(buildHandle(user.acct)))
        .map((user) => user.following_count)
        .reduce((prev, curr) => prev + curr)

      setPercentageCrawled((followeesCrawled / totalFollowing) * 100)
    }, 2000)

    return () => {
      clearInterval(crawlingStatusInterval)
    }
  }, [
    accountHandles,
    buildHandle,
    getCrawlStatus,
    isCrawling,
    rebloggedByUsers,
    totalFollowing,
    tracemapApiDisabled,
  ])

  async function requestTracemapCrawling() {
    if (tracemapApiDisabled) {
      return
    }

    sendCrawlRequest(accountHandles)
    setIsCrawling(true)
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
        css={styles.generateTracemapButton(isCrawling, percentageCrawled)}
        onClick={() => requestTracemapCrawling()}
        disabled={tracemapApiDisabled || isCrawling}
      >
        <span>{isCrawling ? 'generating...' : 'generate TraceMap'}</span>
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
  generateTracemapButton: (isCrawling: boolean, percentageCrawled: number) => css`
    ${mainButton}
    background-color: transparent;

    &:hover {
      background-image: none;
      background-color: ${lightPurple};
    }

    ${isCrawling === true &&
    css`
      &:disabled {
        border-color: white;
        background-image: linear-gradient(
          to right,
          ${darkPurple} ${percentageCrawled}%,
          transparent ${percentageCrawled}%
        );
        span {
          color: transparent;
          background-size: 300% 100%;
          background-repeat: none;
          background-image: linear-gradient(
            to right,
            white 0%,
            white 30%,
            #989898,
            white 70%,
            white 100%
          );
          background-clip: text;
          animation: movingbg linear 2.5s infinite;
        }
      }

      @keyframes movingbg {
        0% {
          background-position: 200% 0%;
        }
        100% {
          background-position: 50% 0%;
        }
      }
    `}
  `,
}
