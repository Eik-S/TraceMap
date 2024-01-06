import { css } from '@emotion/react'
import { CircularProgress } from '@mui/material'
import { useState } from 'react'
import { colorGrayFontAccent, colorGrayLightDivider } from '../../../styles/colors'
import { resetButtonStyles } from '../../../styles/utils'

interface AccordionProps {
  title: string
  children: React.ReactNode
  contentState: 'loading' | 'loaded'
  renderOpen?: boolean
}
export function Accordion({
  title,
  children,
  contentState,
  renderOpen = true,
  ...props
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(renderOpen)

  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div {...props}>
      <button css={styles.button(isOpen)} onClick={toggle} disabled={contentState === 'loading'}>
        <h2 css={styles.title}>{title}</h2>

        {contentState === 'loading' ? (
          <CircularProgress size={18} color="primary" thickness={3} />
        ) : (
          <img
            css={styles.arrowIcon(isOpen)}
            alt=""
            srcSet="
            /icons/arrow-right_128.png 4x,
            /icons/arrow-right_64.png 2x,
            /icons/arrow-right_32.png 1x
            "
            src="/icons/arrow-right_32.png"
          />
        )}
      </button>
      <div css={styles.content(isOpen && contentState === 'loaded')}>{children}</div>
    </div>
  )
}

const styles = {
  button: (isOpen: boolean) => css`
    ${resetButtonStyles}
    position: sticky;
    top: 0;
    z-index: 3;
    width: 100%;
    height: 48px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #fff;
    border-bottom: 1px solid ${colorGrayLightDivider};
    display: grid;
    grid-template-columns: 1fr 18px;
    grid-template-rows: 1fr;
    align-items: center;

    ${isOpen &&
    css`
      border: none;
      box-shadow: 0 0 1px 0 rgba(36, 41, 51, 0.1), 0 2px 2px 0 rgba(15, 19, 26, 0.1),
        0 2px 4px 0 rgba(15, 19, 26, 0.1);
    `}
  `,
  title: css`
    width: 100%;
    color: ${colorGrayFontAccent};
    height: 18px;
    font-size: 18px;
    line-height: 18px;
    text-align: left;
  `,
  arrowIcon: (isOpen: boolean) => css`
    transform: rotate(${isOpen ? '90deg' : '270deg'});
    width: 18px;
  `,
  content: (isOpen: boolean) => css`
    position: relative;
    overflow: hidden;
    height: 0px;
    z-index: 2;

    ${isOpen &&
    css`
      height: auto;
    `}
  `,
}
