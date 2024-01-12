import { css } from '@emotion/react'
import { colorParagraph } from '../../../styles/colors'

export function BoostCounter({ numberOfBoosts, ...props }: { numberOfBoosts: number }) {
  return (
    <div css={styles.boostCounterWrapper} {...props}>
      <img
        css={styles.shareIcon}
        alt=""
        srcSet="
              /icons/share_64.png 4x,
              /icons/share_32.png 2x,
              /icons/share_16.png 1x"
        src="/icons/share_16.png"
      />
      <span css={styles.shareCounter}>{numberOfBoosts}</span>
    </div>
  )
}

const styles = {
  boostCounterWrapper: css`
    display: flex;
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
}
