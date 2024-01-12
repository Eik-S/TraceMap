import { css } from '@emotion/react'
import { Checkbox, Radio, RadioGroup } from '@mui/material'
import { useState } from 'react'
import { colorBlackBg } from '../../../styles/colors'
import { mediaQuery } from '../../../styles/utils'
import { IconButton } from '../../ui-elements/icon-button'
import { useAppSettingsContext } from '../../../contexts/app-settings-context'

export function UserSettings() {
  const [open, setOpen] = useState(false)
  const { setShowBoosts, setSortTimelineBy, showBoosts, sortTimelineBy } = useAppSettingsContext()

  return (
    <div>
      <IconButton
        css={styles.settingsButton}
        ariaLabel={open ? 'close user settings' : 'open user settings'}
        icon={open ? 'gear-purple' : 'gear'}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && <div css={styles.curtain} onClick={() => setOpen(false)} />}
      {open && (
        <div css={styles.tooltip}>
          <div css={styles.tooltipHead}>
            <h2>Timeline Settings</h2>
            <IconButton
              css={styles.tooltipCloseButton}
              ariaLabel="close user settings"
              icon="close-white"
              onClick={() => setOpen(false)}
            />
          </div>
          <div css={styles.tooltipBody}>
            <label htmlFor="sort-timelie-by">sort by:</label>
            <RadioGroup
              id="sort-timelie-by"
              value={sortTimelineBy}
              onChange={(event) => setSortTimelineBy(event.target.value as typeof sortTimelineBy)}
            >
              <div css={styles.option}>
                <Radio color="primary" value="time" id="sort-timeline-by-time" />
                <label htmlFor="sort-timeline-by-time">time</label>
              </div>
              <div css={styles.option}>
                <Radio color="primary" value="boosts" id="sort-timeline-by-retweets" />
                <label htmlFor="sort-timeline-by-retweets">virality</label>
              </div>
            </RadioGroup>
            <div css={styles.option}>
              <Checkbox
                id="timeline-show-boosts"
                color="primary"
                checked={showBoosts}
                onChange={(event) => setShowBoosts(event.target.checked)}
              />
              <label htmlFor="timeline-show-boosts">show boosts</label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
const styles = {
  buttonWrapper: css``,
  settingsButton: css`
    background-color: transparent;
    height: auto;
    height: auto;
  `,
  curtain: css`
    position: fixed;
    z-index: 10;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background-color: ${colorBlackBg};
    opacity: 0.5;
  `,
  tooltip: css`
    position: fixed;
    z-index: 11;
    margin-top: -80px;
    margin-left: 65px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 1px 1px 0 rgba(36, 41, 51, 0.1), 0 2px 2px 0 rgba(15, 19, 26, 0.1),
      0 2px 4px 0 rgba(15, 19, 26, 0.1);

    /* place centered on mobile screens */
    ${mediaQuery.mobile} {
      margin: 0;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `,
  tooltipHead: css`
    background-color: ${colorBlackBg};
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    height: 40px;
    padding: 10px 12.5px;
    display: grid;
    grid-template-columns: 1fr 20px;
    column-gap: 12px;
    align-items: center;
    h2 {
      margin: 0;
      font-size: 15px;
      font-weight: bold;
      color: #fff;
    }
  `,
  tooltipCloseButton: css`
    height: 20px;
    padding: 0;

    img {
      width: 13px;
    }
  `,
  tooltipBody: css`
    padding: 12.5px;

    label {
      display: block;
      padding-bottom: 10px;
      color: ${colorBlackBg};
      font-size: 15px;
    }
  `,
  option: css`
    height: 28px;
    display: grid;
    grid-template-columns: 22px auto;

    .Radio {
      padding: 0;
      height: 22px;
    }

    label {
      margin-left: 12px;
    }
  `,
}
