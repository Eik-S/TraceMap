import { css } from '@emotion/react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { colorGrayBg } from '../../../styles/colors'
import { Accordion } from './accordion'
import { Retweeters } from './retweeters'
import { SearchBar } from './searchBar'
import { SourceTweet } from './sourceTweet'

export function SidePanel() {
  const { tweetID } = useParams()
  const showAccordions = tweetID !== undefined

  const [sourceTweetState, setSourceTweetState] = useState<'loading' | 'loaded'>('loading')
  const [retweeterInfoState, setRetweeterInfoState] = useState<'loading' | 'loaded'>('loading')

  return (
    <div css={styles.wrapper}>
      <SearchBar css={styles.searchBar} />
      {showAccordions && (
        <div>
          <Accordion contentState={sourceTweetState} title="Source Tweet" renderOpen={false}>
            <SourceTweet tweetID={tweetID} onLoaded={() => setSourceTweetState('loaded')} />
          </Accordion>
          <Accordion contentState={retweeterInfoState} title="Retweeters">
            <Retweeters tweetID={tweetID} onLoaded={() => setRetweeterInfoState('loaded')} />
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
