import { css } from '@mui/material'
import { useState } from 'react'
import { colorGrayBg } from '../../../../styles/colors'
import { Accordion } from '../accordion'
import { Retweeters } from './retweeters'
import { useStatusInfoContext } from '../../../../contexts/status-info-context'
import { SourceStatus } from '../source-status'
import { SearchBar } from '../search-bar'

type LoadingState = 'loading' | 'loaded'

export function StatusView() {
  const { statusInfo } = useStatusInfoContext()
  const statusID = statusInfo?.id
  const showAccordions = statusID !== undefined

  const [sourceStatusState, setSourceStatusState] = useState<LoadingState>('loading')
  const [retweeterInfoState, setRetweeterInfoState] = useState<LoadingState>('loading')
  return (
    <div css={styles.wrapper}>
      <SearchBar />
      {showAccordions && (
        <div>
          <Accordion contentState={sourceStatusState} title="Source Status" renderOpen={true}>
            <SourceStatus onLoaded={() => setSourceStatusState('loaded')} />
          </Accordion>
          <Accordion contentState={retweeterInfoState} title="Shared by">
            <Retweeters onLoaded={() => setRetweeterInfoState('loaded')} />
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
    width: 100%;
    height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: 72px minmax(300px, 1fr);
    grid-template-areas:
      'searchbar'
      'accordeons';

    .accordeons {
      grid-area: accordeons;
      position: relative;
      height: 100%;
      max-height: 100%;
    }
  `,
  searchBar: css`
    grid-area: searchbar;
  `,
}
