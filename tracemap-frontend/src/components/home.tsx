import { css } from '@emotion/react'
import { sideGap } from '../styles/utils'
import { Header } from './header'

export function Home() {
  return (
    <div css={styles.homepage}>
      <Header></Header>
      <img css={styles.image} alt="" src="homepage-background-1920.png" />
    </div>
  )
}

const styles = {
  homepage: css`
    overflow: hidden;
    height: 100vh;
  `,
  image: css`
    width: 100%;
    object-fit: cover;
    padding-right: ${sideGap};
  `,
}
