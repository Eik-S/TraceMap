import { css } from '@emotion/react'
import { colorGrayFontDark } from '../../../styles/colors'
import { ReactNode } from 'react'

interface IconButtonProps {
  icon: 'loupe' | 'chevron-right' | 'gear' | 'gear-purple' | 'close-white'
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
      {icon === 'gear' && <GearIcon />}
      {icon === 'gear-purple' && <GearIconPurple />}
      {icon === 'close-white' && <CloseWhite />}
      {children}
    </button>
  )
}

function ChevronRightIcon() {
  return (
    <img
      css={styles.chevronRightIcon}
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

function GearIcon() {
  return (
    <img
      css={styles.gearIcon}
      srcSet="
        /icons/settings-gear_128.png 4x,
        /icons/settings-gear_64.png 2x,
        /icons/settings-gear_32.png 1x,
        "
      src="/icons/settings-gear_32.png"
      alt=""
    />
  )
}

function GearIconPurple() {
  return (
    <img
      css={styles.gearIcon}
      srcSet="
        /icons/settings-gear-purple_128.png 4x,
        /icons/settings-gear-purple_64.png 2x,
        /icons/settings-gear-purple_32.png 1x,
        "
      src="/icons/settings-gear-purple_32.png"
      alt=""
    />
  )
}

function CloseWhite() {
  return (
    <img
      srcSet="
        /icons/close-white_128.png 4x,
        /icons/close-white_64.png 2x,
        /icons/close-white_32.png 1x,
        "
      src="/icons/close-white_32.png"
      alt=""
    />
  )
}

const styles = {
  iconButton: css`
    height: 72px;
    background-color: ${colorGrayFontDark};
    border: none;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 20px;
    }
  `,
  chevronRightIcon: css`
    margin-bottom: -2px;
  `,
  gearIcon: css`
    margin-bottom: -3px;
  `,
}
