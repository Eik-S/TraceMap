import { css } from '@emotion/react'
import { useEffect, useState } from 'react'
import { colorGrayFontDark } from '../../../styles/colors'
import { IconButton } from '../ui-elements/icon-button'
import { SearchBar } from './search-bar'
import { mediaQuery } from '../../../styles/utils'

interface ControlBarProps {
  onToggleOpenState: (state: boolean) => void
}

export function ControlBar({ onToggleOpenState }: ControlBarProps) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    onToggleOpenState(isOpen)
  }, [isOpen, onToggleOpenState])

  return (
    <div css={styles.controlBar}>
      <IconButton
        icon="chevron-right"
        ariaLabel="close side panel"
        css={styles.closeButton}
        onClick={() => setIsOpen(false)}
      />
      <SearchBar css={styles.searchBar} />
      <IconButton
        icon="chevron-right"
        ariaLabel="open side panel"
        css={styles.openButton}
        onClick={() => setIsOpen(true)}
      />
    </div>
  )
}

const styles = {
  controlBar: css`
    background-color: ${colorGrayFontDark};
    display: grid;
    grid-template-columns: auto 1fr;
    padding-right: 20px;

    ${mediaQuery.desktop} {
      grid-template-columns: 20px 1fr;
    }
  `,
  closeButton: css`
    transform: rotate(180deg);
    ${mediaQuery.desktop} {
      display: none;
    }
  `,
  searchBar: css`
    grid-column: 2;
  `,
  openButton: css`
    position: fixed;
    left: 0;
    z-index: -1;
    ${mediaQuery.desktop} {
      display: none;
    }
  `,
}
