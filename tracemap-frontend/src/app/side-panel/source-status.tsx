import { css } from '@emotion/react'
import { useEffect } from 'react'
import { useStatusInfoContext } from '../../contexts/status-info-context'
import { Toot } from '../ui-elements/toot/toot'
import { BoostCounter } from '../ui-elements/toot/boost-counter'

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
        <BoostCounter css={styles.boostCounter} numberOfBoosts={statusInfo.reblogs_count} />
      </div>
    )
  }

  return null
}

const styles = {
  wrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  boostCounter: css`
    margin: 8px 0 0 12px;
  `,
}
