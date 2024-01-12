import { css } from '@emotion/react'
import { colorGrayBgLight } from '../../../styles/colors'
import { mediaQuery, scrollContainer } from '../../../styles/utils'
import { IconButton } from '../../ui-elements/icon-button'
import { User } from '../../ui-elements/user'
import { useUserInfo } from './hooks/use-user-info'
import { UserInfo } from './user-info'
import { UserSettings } from './user-settings'
import { UserTimeline } from './user-timeline'
import { WordCloud } from './word-cloud/word-cloud'

export function UserView({ ...props }) {
  const { userInfo, userTimeline, fetchNextTimelinePage, isFetchingTimeline } = useUserInfo()
  const open = typeof userInfo !== 'undefined'
  console.log('userView rerendered')

  function closeUserDetails() {
    window.history.back()
  }

  function fetchMorePostsIfOnBottom(element: HTMLDivElement) {
    if (isFetchingTimeline) {
      return
    }
    const scrollLeft = element.scrollHeight - (element.scrollTop + element.offsetHeight)
    if (scrollLeft < 300) {
      fetchNextTimelinePage()
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
          <UserSettings />
        </div>
      )}
      <div
        css={scrollContainer}
        onScroll={(event) => fetchMorePostsIfOnBottom(event.target as HTMLDivElement)}
      >
        {userInfo && <UserInfo userInfo={userInfo} />}
        <WordCloud timeline={userTimeline} key={userInfo?.id} />
        <UserTimeline
          css={styles.userTimeline}
          content={userTimeline}
          loading={isFetchingTimeline}
        />
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
    padding: 20px 20px 15px;
    background-color: white;
    box-shadow: 0 0 1px 0 rgba(36, 41, 51, 0.1), 0 2px 2px 0 rgba(15, 19, 26, 0.1),
      0 2px 4px 0 rgba(15, 19, 26, 0.1);
    z-index: 1;

    display: grid;
    grid-template-columns: 1fr 40px;
  `,
  userTimeline: css`
    margin: 20px;
  `,
  loadingSpinner: css`
    margin-bottom: 25px;
    align-self: center;
  `,
}
