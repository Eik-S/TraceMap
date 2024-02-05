import { css } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'
import { Relations } from 'tracemap-api-types'
import { useStatusInfoContext } from '../../../contexts/status-info-context'
import { useTracemapRendering } from './use-tracemap-rendering'

interface TracemapGraphProps {
  inputData: Relations
}

export function TracemapGraph({ inputData, ...props }: TracemapGraphProps) {
  const { creatorHandle } = useStatusInfoContext()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasElem, setCanvasElem] = useState<HTMLCanvasElement | undefined>()
  const { initTracemap } = useTracemapRendering({
    canvasElem: canvasElem,
    inputData: inputData,
    creatorHandle: creatorHandle,
  })

  useEffect(() => {
    if (canvasRef.current == null) {
      return
    }

    setCanvasElem(canvasRef.current)
  }, [canvasRef])

  useEffect(() => {
    if (typeof creatorHandle === 'undefined' || typeof canvasElem === 'undefined') {
      return
    }
    initTracemap()
  }, [canvasElem, creatorHandle, initTracemap, inputData])

  function resizeCanvas() {}
  return <canvas css={styles.graph} ref={canvasRef} onResize={() => resizeCanvas()} {...props} />
}

const styles = {
  graph: css`
    width: 100%;
    height: 100%;
  `,
}
