import { css } from '@emotion/react'
import { SearchBar } from './searchBar'

export function SidePanel() {
  return (
    <div css={styles.wrapper}>
      <SearchBar css={styles.searchBar} />
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
