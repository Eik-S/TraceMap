import { css } from '@emotion/react'
import { useEffect } from 'react'
import { useStatusInfoContext } from '../../../contexts/status-info-context'
import { Toot } from '../ui-elements/toot'

interface SourceTootProps {
  onLoaded: () => void
}
export function SourceStatus({ onLoaded }: SourceTootProps) {
  const { statusInfo } = useStatusInfoContext()

  useEffect(() => {
    if (statusInfo) {
      onLoaded()
    }
  }, [onLoaded, statusInfo])

  if (statusInfo) {
    return (
      <div css={styles.wrapper}>
        <Toot status={statusInfo} />
      </div>
    )
  }

  return null
}

const styles = {
  wrapper: css`
    display: flex;
    justify-content: center;
    margin: 16px 0;
  `,
}
