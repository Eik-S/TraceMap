import { css } from '@emotion/react'
import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useUserInfoContext } from '../../../../contexts/user-info-context'
import { colorGrayBgLight } from '../../../../styles/colors'
import { mediaQuery, scrollContainer } from '../../../../styles/utils'
import { IconButton } from '../../ui-elements/icon-button'
import { User } from '../../ui-elements/user'
import { Timeline } from './timeline'
import { UserInfo } from './user-info'
import { WordCloud } from './word-cloud'

export function UserView({ ...props }) {
  const { userInfo, userTimeline, fetchNextTimelinePage } = useUserInfoContext()
  const open = typeof userInfo !== 'undefined'

  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    setIsFetching(false)
  }, [userTimeline.length])

  function closeUserDetails() {
    window.history.back()
  }

  async function fetchMorePostsIfOnBottom(element: HTMLDivElement) {
    if (isFetching) {
      return
    }
    const scrollLeft = element.scrollHeight - (element.scrollTop + element.offsetHeight)
    if (scrollLeft < 300) {
      setIsFetching(true)
      void (await fetchNextTimelinePage())
      setIsFetching(false)
    }
  }

  return (
    <div css={styles.wrapper(open)} aria-hidden={open ? 'false' : 'true'} {...props}>
      <IconButton
        css={styles.closeButton}
        icon="chevron-right"
        ariaLabel="close user details"
        onClick={closeUserDetails}
      >
        <span css={styles.closeText}>Back</span>
      </IconButton>
      {userInfo && (
        <div css={styles.userBase}>
          <User user={userInfo} />
        </div>
      )}
      <div
        css={styles.timelineWrapper}
        onScroll={(event) => fetchMorePostsIfOnBottom(event.target as HTMLDivElement)}
      >
        {userInfo && <UserInfo userInfo={userInfo} />}
        <WordCloud />
        <Timeline content={userTimeline} />
        <CircularProgress css={styles.loadingSpinner} />
      </div>
    </div>
  )
}

const styles = {
  wrapper: (open: boolean) => css`
    z-index: 3;
    background-color: ${colorGrayBgLight};
    transition: margin 0.4s;
    max-height: 100%;
    overflow: hidden;
    display: grid;
    grid-auto-flow: row;
    align-content: baseline;

    width: 370px;
    margin-left: -370px;
    ${mediaQuery.mobile} {
      width: 100vw;
      margin-left: -100vw;
      ${open &&
      css`
        margin-left: 0;
      `}
    }

    ${open &&
    css`
      margin-left: 0;
    `}
  `,
  closeButton: css`
    display: grid;
    grid-template-columns: auto auto;
    justify-content: left;
    img {
      transform: rotate(180deg);
    }
  `,
  closeText: css`
    margin-left: 10px;
    color: white;
    font-size: 18px;
    line-height: 20px;
  `,
  userBase: css`
    position: relative;
    padding: 20px 20px 15px;
    background-color: white;
    box-shadow: 0 0 1px 0 rgba(36, 41, 51, 0.1), 0 2px 2px 0 rgba(15, 19, 26, 0.1),
      0 2px 4px 0 rgba(15, 19, 26, 0.1);
  `,
  timelineWrapper: css`
    display: flex;
    flex-direction: column;
    ${scrollContainer}
  `,
  loadingSpinner: css`
    margin-bottom: 25px;
    align-self: center;
  `,
}
