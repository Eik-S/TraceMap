import { css } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import { theme } from '../../styles/theme'
import { TweetInfoProvider } from '../../twitter-api/tweet-info-context'
import { SidePanel } from './side-panel/sidePanel'

export function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <TweetInfoProvider>
        <div css={styles.wrapper}>
          <SidePanel />
        </div>
      </TweetInfoProvider>
    </ThemeProvider>
  )
}

const styles = {
  wrapper: css`
    display: grid;
    height: 100vh;
    grid-template-columns: 360px 1fr;
    grid-template-rows: 1fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,
}
