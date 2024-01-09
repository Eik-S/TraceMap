import { css } from '@emotion/react'

export const sideGap = '24px'
export const sideGapMobile = '12px'

export const resetInputStyles = css`
  background-color: transparent;
  border: none;
  outline: none;
`

export const resetButtonStyles = css`
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
`

export const scrollContainer = css`
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

export const mediaQuery = {
  mobile: '@media screen and (max-width: 900px)',
  desktop: '@media screen and (min-width: 901px)',
}
