import { css } from '@emotion/react'
import { StatusInfoProvider } from '../../contexts/status-info-context'
import { colorGrayLightDivider } from '../../styles/colors'
import { Header } from '../header'
import { MainPanel } from './main-panel/main-panel'
import { SidePanel } from './side-panel/side-panel'
import { mediaQuery } from '../../styles/utils'

export function AppWrapper() {
  return (
    <div css={styles.wrapper}>
      <Header css={styles.header} />
      <StatusInfoProvider>
        <SidePanel css={styles.sidePanel} />
        <MainPanel css={styles.mainPanel} />
      </StatusInfoProvider>
    </div>
  )
}

const styles = {
  wrapper: css`
    position: relative;
    display: grid;
    height: 100vh;
    grid-template-columns: 370px 1fr;
    grid-template-rows: auto 1fr;

    ${mediaQuery.mobile} {
      grid-template-columns: 1fr;
    }
  `,
  header: css`
    grid-column: 1 / span 2;
    border-bottom: 1px solid ${colorGrayLightDivider};

    ${mediaQuery.mobile} {
      grid-column: 1;
    }
  `,

  sidePanel: css`
    ${mediaQuery.mobile} {
      z-index: 2;
      grid-column: 1;
      grid-row: 2;
    }
  `,
  mainPanel: css`
    ${mediaQuery.mobile} {
      z-index: 1;
      grid-column: 1;
      grid-row: 2;
    }
  `,
}
