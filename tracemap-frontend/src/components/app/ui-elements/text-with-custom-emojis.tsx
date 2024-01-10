import { css } from '@emotion/react'
import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { Emoji } from 'tracemap-api-types'

interface TextWithCustomEmojisProps {
  input: string
  emojis: Emoji[]
}

export function TextWithCustomEmojis({
  input,
  emojis,
  ...props
}: TextWithCustomEmojisProps): EmotionJSX.Element {
  if (emojis.length === 0) {
    return <span {...props}>{input}</span>
  }

  const inputParts = input.split(/(:[a-zA-Z0-9_-]+:)/)
  const outputParts: EmotionJSX.Element[] = []

  inputParts.forEach((part, index) => {
    const matchingEmoji = emojis.find((emoji) => `:${emoji.shortcode}:` === part)

    if (matchingEmoji) {
      outputParts.push(<img css={styles.customEmoji} src={matchingEmoji.url} alt="" key={index} />)
    } else {
      outputParts.push(<span key={index}>{part}</span>)
    }
  })

  return <span {...props}>{outputParts.map((elem) => elem)}</span>
}

const styles = {
  customEmoji: css`
    display: inline;
    vertical-align: sub;
    width: 17px;
  `,
}
