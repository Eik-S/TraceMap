import { css } from '@emotion/react'
import { useEffect } from 'react'
import wc from 'wordcloud'
import { colorHeader } from '../../../../styles/colors'
import { useWordCloudData } from './use-word-cloud-data'
import { Status } from 'tracemap-api-types'
import { useAppSettingsContext } from '../../../../contexts/app-settings-context'

interface WordCloudProps {
  timeline: Status[]
}

export function WordCloud({ timeline, ...props }: WordCloudProps) {
  const canvas = document.getElementById('wordcloud-canvas') as HTMLCanvasElement | null
  const { wordcloudOptions, statusCount } = useWordCloudData(timeline)
  const { showBoosts } = useAppSettingsContext()

  useEffect(() => {
    if (canvas === null) {
      return
    }
    const [width, height] = [canvas.clientWidth, canvas.clientHeight]
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr

    wc(canvas, wordcloudOptions)
  }, [canvas, wordcloudOptions])

  return (
    <div css={styles.wordcloudWrapper} {...props}>
      <h2 css={styles.headline}>
        Semantic cloud of last {statusCount} posts {showBoosts && 'and boosts'}
      </h2>
      <canvas id="wordcloud-canvas" css={styles.wordcloudCanvas} />
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
  wordcloudCanvas: css`
    margin: 10px 0;
    height: 250px;
    width: 100%;
  `,
}
