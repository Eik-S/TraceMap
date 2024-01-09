import { css } from '@emotion/react'
import { colorGrayFontLight } from '../../../../styles/colors'
import { Toot } from './toot'
import { TootInfo } from './toot-info'
import { Status } from '../../../../services/useMastoClientApi'

export interface TootCardProps {
  status: Status
  showInfo?: boolean
}

export function TootCard({ status, showInfo = true, ...props }: TootCardProps) {
  const isReblog = status.reblog !== null
  const content = status.reblog || status
  const [server, statusId] = (() => {
    const url = new URL(content.url)
    return [url.hostname, url.pathname.split('/').pop()]
  })()

  return (
    <div>
      {isReblog && <ReblogNotice />}
      <Toot status={content} />
      <TootInfo id={statusId!} server={server} reblogsCount={content.reblogs_count} />
    </div>
  )
}

function ReblogNotice() {
  return (
    <div css={styles.reblogNotice}>
      <img
        alt=""
        srcSet="
              /icons/share_64.png 4x,
              /icons/share_32.png 2x,
              /icons/share_16.png 1x"
        src="/icons/share_16.png"
      />
      <span>boosted</span>
    </div>
  )
}

const styles = {
  reblogNotice: css`
    margin: 0px 0px 8px 8px;
    font-weight: bold;
    font-size: 14px;
    color: ${colorGrayFontLight};
    display: flex;
    justify-items: center;

    img {
      margin-right: 5px;
      width: 16px;
      padding-top: 1px;
    }
  `,
}
