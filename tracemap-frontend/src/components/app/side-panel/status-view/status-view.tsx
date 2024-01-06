import { css } from '@mui/material'
import { useState } from 'react'
import { useStatusInfoContext } from '../../../../contexts/status-info-context'
import { colorGrayBg } from '../../../../styles/colors'
import { scrollContainer } from '../../../../styles/utils'
import { Accordion } from '../accordion'
import { SearchBar } from '../search-bar'
import { SourceStatus } from '../source-status'
import { SharedByUsers } from './shared-by-users'

type LoadingState = 'loading' | 'loaded'

export function StatusView() {
  const { statusInfo } = useStatusInfoContext()
  const statusID = statusInfo?.id
  const showAccordions = statusID !== undefined

  const [sourceStatusState, setSourceStatusState] = useState<LoadingState>('loading')
  const [sharedByState, setSharedByState] = useState<LoadingState>('loading')
  return (
    <div css={styles.wrapper}>
      <SearchBar />
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
    display: grid;
    overflow: hidden;
    grid-template-columns: 1fr;
    grid-template-rows: 72px minmax(300px, 1fr);
    grid-template-areas:
      'searchbar'
      'accordeons';
  `,
  accordeons: css`
    grid-area: 'accordeons';
    position: relative;
    height: 100%;
    max-height: 100%;
    ${scrollContainer}
  `,
}
