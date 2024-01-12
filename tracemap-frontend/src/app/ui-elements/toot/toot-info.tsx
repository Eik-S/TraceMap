import { css } from '@emotion/react'
import { colorParagraph, darkPurple, colorGrayPlaceholder } from '../../../styles/colors'

interface TootInfoProps {
  id: string
  server: string
  reblogsCount: number
}

export function TootInfo({ id, server, reblogsCount }: TootInfoProps) {
  function openStatusOnTraceMap() {
    window.location.href = `/app/${id}@${server}`
  }

  return (
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
      <span css={styles.shareCounter}>{reblogsCount}</span>
      <button css={styles.purpleButton} onClick={() => openStatusOnTraceMap()}>
        Show Tracemap
        <div css={styles.circle} />
      </button>
    </div>
  )
}

const styles = {
  statusInfo: css`
    display: grid;
    margin: 8px 0 12px 12px;
    grid-template-columns: 16px auto 1fr;
    align-items: center;
  `,
  shareIcon: css`
    width: 16px;
    padding-top: 1px;
  `,
  shareCounter: css`
    font-size: 14px;
    margin-left: 10px;
    color: ${colorParagraph};
    font-weight: 600;
    line-height: 11px;
  `,
  purpleButton: css`
    cursor: pointer;
    border: none;
    background-color: ${darkPurple};
    color: white;
    &:disabled {
      background-color: ${colorGrayPlaceholder};
      border: 2px solid ${colorGrayPlaceholder};
    }

    width: 136px;
    height: 30px;
    align-self: center;
    line-height: 20px;
    justify-self: right;
    border-radius: 5px;
    font-size: 12px;
    font-weight: bold;
    text-align: left;
    padding: 0px 10px;
  `,
  circle: css`
    width: 14px;
    height: 14px;
    background-color: ${darkPurple};
    border: 4px solid #fff;
    border-radius: 50%;
    float: right;
    margin-top: 3px;
  `,
}
