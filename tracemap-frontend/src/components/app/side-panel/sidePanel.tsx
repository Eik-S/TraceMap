import { css } from '@emotion/react'
import { useState } from 'react'
import { Accordion } from './accordion'
import { SearchBar } from './searchBar'
import { SourceTweet } from './sourceTweet'

export function SidePanel() {
  // TODO: dont use state and handle directly in accordion
  const [sourceTweetState, setSourceTweetState] = useState<'loading' | 'loaded'>('loading')

  return (
    <div css={styles.wrapper}>
      <SearchBar css={styles.searchBar} />
      <Accordion contentState={sourceTweetState} title="Source Tweet">
        <SourceTweet onLoaded={() => setSourceTweetState('loaded')} />
      </Accordion>
    </div>
  )
}

const styles = {
  wrapper: css`
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
