import { css } from '@emotion/react'
import { colorGrayFontBlackish, colorParagraph } from '../../styles/colors'

interface NumericMetricProps {
  label: string
  value: number
}

export function NumericMetric({ label, value, ...props }: NumericMetricProps) {
  const valueId = label.replaceAll(' ', '-')

  const shortValue = (() => {
    const k = 1000
    const mil = k * 1000

    if (value > mil) {
      return `${(value / mil).toFixed(1)}mil`
    }
    if (value > k) {
      return `${(value / k).toFixed(1)}k`
    }
    return `${value}`
  })()

  return (
    <div css={styles.metric} {...props}>
      <span id={valueId}>{shortValue}</span>
      <label htmlFor={valueId}>{label}</label>
    </div>
  )
}

const styles = {
  metric: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      font-size: 20px;
      color: ${colorParagraph};
      font-weight: bold;
    }
    label {
      font-size: 14px;
      color: ${colorGrayFontBlackish};
    }
  `,
}
