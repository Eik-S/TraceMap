import { css } from '@mui/material'
import { ReactNode, useState } from 'react'
import { useStatusInfoContext } from '../../../../contexts/status-info-context'
import { colorGrayBg } from '../../../../styles/colors'
import { scrollContainer } from '../../../../styles/utils'
import { Accordion } from '../accordion'
import { SourceStatus } from '../source-status'
import { SharedByUsers } from './shared-by-users'

type LoadingState = 'loading' | 'loaded'

interface StatusViewProps {
  children?: ReactNode
}

export function StatusView({ children, ...props }: StatusViewProps) {
  const { statusInfo } = useStatusInfoContext()
  const statusID = statusInfo?.id
  const showAccordions = statusID !== undefined

  const [sourceStatusState, setSourceStatusState] = useState<LoadingState>('loading')
  const [sharedByState, setSharedByState] = useState<LoadingState>('loading')
  return (
    <div css={styles.wrapper} {...props}>
      {children}
      {showAccordions && (
        <div css={styles.accordeons}>
          <Accordion contentState={sourceStatusState} title="Source Status" renderOpen={true}>
            <SourceStatus onLoaded={() => setSourceStatusState('loaded')} />
          </Accordion>
          <Accordion contentState={sharedByState} title="Shared by">
            <SharedByUsers onLoaded={() => setSharedByState('loaded')} />
          </Accordion>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: css`
    background-color: ${colorGrayBg};
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(300px, 1fr);
  `,
  accordeons: css`
    grid-area: 'accordeons';
    position: relative;
    height: 100%;
    max-height: 100%;
    ${scrollContainer}
  `,
}
