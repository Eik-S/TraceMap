import { css } from '@emotion/react'
import { colorGrayFontDark, colorGrayPlaceholder, darkPurple, lightPurple } from './colors'

export const mainButton = css`
  border: 8px solid #fff;
  background-color: ${darkPurple};
  padding: 15px 30px;
  color: #fff;
  font-size: 32px;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-image: radial-gradient(${lightPurple}, ${darkPurple});
  }

  &:disabled {
    background-image: none;
    background-color: transparent;
    border-color: ${colorGrayPlaceholder};
    color: ${colorGrayPlaceholder};
  }
`

export const iconButton = css`
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  color: ${colorGrayFontDark};
  gap: 4px;
  transition: gap 0.1s linear;

  img {
    height: 20px;
  }

  &:hover {
    gap: 0;
    text-decoration: underline;
  }

  &:active {
    gap: 4px;
  }
`
