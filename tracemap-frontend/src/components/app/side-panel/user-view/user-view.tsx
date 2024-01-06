import { css } from '@emotion/react'
import { useUserInfoContext } from '../../../../contexts/user-info-context'
import { colorGrayBgLight, colorGrayFontDark } from '../../../../styles/colors'
import { scrollContainer } from '../../../../styles/utils'
import { User } from '../../ui-elements/user-card'
import { Timeline } from './timeline'
import { UserInfo } from './user-info'
import { WordCloud } from './word-cloud'

export function UserView() {
  const { userInfo, userTimeline, fetchNextTimelinePage } = useUserInfoContext()
  const open = typeof userInfo !== 'undefined'

  function closeUserDetails() {
    window.history.back()
  }

  return (
    <div css={styles.wrapper(open)} aria-hidden={open ? 'false' : 'true'}>
      <button css={styles.backButton} onClick={() => closeUserDetails()}>
        <img
          srcSet="
        /icons/arrow-right-white_128.png 4x,
        /icons/arrow-right-white_64.png 2x,
        /icons/arrow-right-white_32.png 1x,
        "
          src="/icons/arrow-right-white_64.png"
          alt="go back to status"
        />
        <span>Back</span>
      </button>
      {userInfo && (
        <div css={styles.userBase}>
          <User {...userInfo} />
        </div>
      )}
      <div css={scrollContainer}>
        {userInfo && <UserInfo userInfo={userInfo} />}
        <WordCloud />
        <Timeline content={userTimeline} fetchNextTimelinePage={fetchNextTimelinePage} />
      </div>
    </div>
  )
}

const styles = {
  wrapper: (open: boolean) => css`
    z-index: 4;
    background-color: ${colorGrayBgLight};
    transition: margin 0.4s;
    max-height: 100%;
    overflow: hidden;
    margin-left: -370px;
    width: 370px;
    display: grid;
    grid-auto-flow: row;
    align-content: baseline;

    ${open &&
    css`
      margin-left: 0;
    `}
  `,
  backButton: css`
    display: block;
    width: 100%;
    height: 72px;
    background-color: ${colorGrayFontDark};
    border: none;
    padding-left: 20px;
    align-items: center;
    justify-content: left;
    display: grid;
    grid-template-columns: 20px auto;
    grid-template-rows: 1fr;
    cursor: pointer;

    img {
      width: 20px;
      transform: rotate(180deg);
      transition: transform 0.1s linear;
    }

    span {
      display: block;
      margin-left: 10px;
      color: white;
      font-size: 18px;
      line-height: 20px;
    }

    &:hover {
      img {
        transform: rotate(180deg) translateX(-5px);
      }
    }

    &:active {
      img {
        transform: rotate(180deg);
      }
    }
  `,
  userBase: css`
    position: relative;
    padding: 20px 20px 15px;
    background-color: white;
    box-shadow: 0 0 1px 0 rgba(36, 41, 51, 0.1), 0 2px 2px 0 rgba(15, 19, 26, 0.1),
      0 2px 4px 0 rgba(15, 19, 26, 0.1);
  `,
}
