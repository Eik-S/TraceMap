import { css } from '@emotion/react'
import { colorHeader } from '../../../../styles/colors'

export function WordCloud({ ...props }) {
  return (
    <div css={styles.wordcloudWrapper} {...props}>
      <h2 css={styles.headline}>Semantic cloud</h2>
      <canvas css={styles.canvas} />
    </div>
  )
}

const styles = {
  wordcloudWrapper: css`
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 1px 1px 0 rgba(36, 41, 51, 0.1), 0 2px 2px 0 rgba(15, 19, 26, 0.1),
      0 2px 4px 0 rgba(15, 19, 26, 0.1);
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 24px auto;
  `,
  headline: css`
    font-size: 16px;
    font-weight: bold;
    align-self: center;
    margin-left: 5px;
    color: ${colorHeader};
  `,
  canvas: css`
    width: 238px;
    height: 250px;
  `,
}
