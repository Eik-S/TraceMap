import { css } from '@emotion/react'
import { useState } from 'react'
import { colorGrayPlaceholder } from '../../../styles/colors'
import { resetInputStyles } from '../../../styles/utils'
import { IconButton } from '../ui-elements/icon-button'

export function SearchBar({ ...props }) {
  const [searchTerm, setSearchTerm] = useState('')

  function search() {
    const status = parseStatusIDAndServerFromSearchTerm()

    if (status === undefined) {
      return
    }

    window.location.href = `/app/${status}`
  }

  function handleKeyboardEvent(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      search()
    }
  }

  function parseStatusIDAndServerFromSearchTerm() {
    // https://mastodon.social/@janboehm@edi.social/111697742855340300
    // becomes 111697742855340300@edi.social
    const statusServer = new URL(searchTerm).hostname

    const matchResult = searchTerm.match(/[0-9]+$/)
    if (matchResult === null) {
      return undefined
    }
    const statusID = matchResult[0]

    return `${statusID}@${statusServer}`
  }

  return (
    <div css={styles.searchBar} {...props}>
      <input
        css={styles.searchInput}
        type="text"
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={(event) => handleKeyboardEvent(event)}
        placeholder="Enter Tweet URL"
      />
      <IconButton
        css={styles.loupe}
        icon="loupe"
        ariaLabel="submit search"
        onClick={() => search()}
      />
    </div>
  )
}

const styles = {
  searchBar: css`
    position: relative;
    height: 72px;
    width: 100%;

    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  `,
  searchInput: css`
    ${resetInputStyles}
    height: 28px;
    margin-right: 20px;
    font-size: 18px;
    color: #fff;
    line-height: 18px;
    &::placeholder {
      color: ${colorGrayPlaceholder};
      opacity: 1;
    }
  `,
  loupe: css`
    padding-right: 0;
  `,
}
