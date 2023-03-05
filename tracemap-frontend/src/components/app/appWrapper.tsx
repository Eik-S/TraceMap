import { css } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import { theme } from '../../styles/theme'
import { SidePanel } from './side-panel/sidePanel'
import { TwitterApiProvider } from './twitter-api/twitterApiContext'

export function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <TwitterApiProvider>
        <div css={styles.wrapper}>
          <SidePanel />
        </div>
      </TwitterApiProvider>
    </ThemeProvider>
  )
}

const styles = {
  wrapper: css`
    display: grid;
    height: 100vh;
    grid-template-columns: 360px 1fr;
    grid-template-rows: 1fr;
  `,
}
