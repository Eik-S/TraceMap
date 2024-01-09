import { css } from '@emotion/react'
import { colorGrayFontDark } from '../../../styles/colors'
import { ReactNode } from 'react'

interface IconButtonProps {
  icon: 'loupe' | 'chevron-right'
  ariaLabel: string
  onClick: () => void
  showText?: boolean
  children?: ReactNode
}

export function IconButton({
  icon,
  ariaLabel,
  onClick,
  showText = true,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button css={styles.iconButton} onClick={() => onClick()} {...props} aria-label={ariaLabel}>
      {icon === 'chevron-right' && <ChevronRightIcon />}
      {icon === 'loupe' && <LoupeIcon />}
      {children}
    </button>
  )
}

function ChevronRightIcon() {
  return (
    <img
      srcSet="
        /icons/arrow-right-white_128.png 4x,
        /icons/arrow-right-white_64.png 2x,
        /icons/arrow-right-white_32.png 1x,
        "
      src="/icons/arrow-right-white_64.png"
      alt=""
    />
  )
}

function LoupeIcon() {
  return (
    <img
      srcSet="
      /icons/loupe-fat_128.png 4x,
      /icons/loupe-fat_64.png 2x,
      /icons/loupe-fat_32.png 1x,"
      src="/icons/loupe_32.png"
      alt=""
    />
  )
}

const styles = {
  iconButton: css`
    display: block;
    height: 72px;
    background-color: ${colorGrayFontDark};
    border: none;
    padding: 12px;
    align-items: center;

    img {
      width: 20px;
    }
  `,
}
