import { css } from '@emotion/react'
import { colorGrayPlaceholder, darkPurple } from '../../../styles/colors'
import { BoostCounter } from './boost-counter'

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
      <BoostCounter numberOfBoosts={reblogsCount} />
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
    grid-template-columns: auto 1fr;
    align-items: center;
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
