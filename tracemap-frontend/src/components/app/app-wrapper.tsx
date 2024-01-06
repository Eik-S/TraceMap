import { css } from '@emotion/react'
import { StatusInfoProvider } from '../../contexts/status-info-context'
import { colorGrayLightDivider } from '../../styles/colors'
import { Header } from '../header'
import { MainPanel } from './main-panel/main-panel'
import { SidePanel } from './side-panel/side-panel'

export function AppWrapper() {
  return (
    <div css={styles.wrapper}>
      <Header css={styles.header} />
      <StatusInfoProvider>
        <SidePanel />
        <MainPanel />
      </StatusInfoProvider>
    </div>
  )
}

const styles = {
  wrapper: css`
    display: grid;
    height: 100vh;
    overflow: hidden;
    grid-template-columns: 370px 1fr;
    grid-template-rows: auto 1fr;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,
  header: css`
    grid-column: 1 / span 2;
    border-bottom: 1px solid ${colorGrayLightDivider};
  `,
}
