import { useEffect, useState } from 'react'
import { Status } from 'tracemap-api-types'
import wc from 'wordcloud'
import { colorGrayFontDark, darkPurple } from '../../../../styles/colors'
import { useAppSettingsContext } from '../../../../contexts/app-settings-context'
import { filterBoosts } from '../../../../utils/timeline-utils'

const cloudColors = {
  handles: '#626570',
  hashtags: colorGrayFontDark,
  words: darkPurple,
}

export function useWordCloudData(timeline: Status[]) {
  const { showBoosts } = useAppSettingsContext()
  const filteredTimeline = showBoosts ? timeline : filterBoosts(timeline)
  const [lastTimelineLength, setLastTimelineLength] = useState(0)
  const [wordList, setWordList] = useState<Word[]>([])
  const wordListWeightFactor = wordList[0]
    ? 1000 / wordList[0][1] - wordList[wordList.length - 1][1]
    : 1

  useEffect(() => {
    // this useEffect is expensive and should not run unnecessarily
    if (lastTimelineLength === filteredTimeline.length) {
      return
    }

    const newTimelineContent = filteredTimeline.slice(lastTimelineLength)
    const text = newTimelineContent
      .map((status) => getTextFromStatusContent(status.reblog?.content || status.content))
      .join(' ')

    getWordListFromText(text).then((newWords) => {
      setWordList((prev) => mergeWordLists(prev, newWords))

      setLastTimelineLength(filteredTimeline.length)
    })

    // cannot exhaust because this useEffect reads and sets lastTimelineLength
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTimeline])

  const dpr = window.devicePixelRatio || 1
  const wordcloudOptions: wc.Options = {
    list: wordList.slice(0, 50),
    backgroundColor: 'white',
    color: (word) => {
      if (word.indexOf('#') === 0) {
        return cloudColors.hashtags
      }
      if (word.indexOf('@') === 0) {
        return cloudColors.handles
      }
      return cloudColors.words
    },
    fontFamily: 'IBM Plex Sans',
    weightFactor: (size) => (Math.sqrt(size * wordListWeightFactor) + 2) * dpr,
    drawOutOfBound: false,
    shuffle: false,
    minRotation: (-30 * Math.PI) / 180,
    maxRotation: (30 * Math.PI) / 180,
    rotationSteps: 2,
    rotateRatio: 0.3,
  }
  return {
    wordcloudOptions,
    wordList,
    statusCount: lastTimelineLength,
  }
}

function getTextFromStatusContent(content: string): string {
  const span = document.createElement('span')
  span.innerHTML = content
  span.querySelectorAll('a:not(.mention):not(.hashtag)').forEach((e) => e.replaceWith(' '))
  // return foundTexts.join(' ').replaceAll(/ +/g, ' ')
  const text = span.textContent || span.innerHTML
  return text.replaceAll(/ +/g, ' ').trim()
}

type Word = [string, number]

async function getWordListFromText(text: string): Promise<Word[]> {
  const wordDict: Record<string, number> = {}
  const textwords = text.replace(/[^#@ßüäöÜÄÖ€ \w\n]/g, '').split(/[\s+]/g)

  textwords.forEach((word) => {
    if (word.length > 2) {
      wordDict[word] ? wordDict[word]++ : (wordDict[word] = 1)
    }
  })

  const stopWords = await getStopwordLists()
  const wordList: Word[] = []
  Object.entries(wordDict).forEach((wordTuple) => {
    const word = wordTuple[0].toLowerCase()
    if (stopWords.indexOf(word) === -1) {
      wordList.push(wordTuple)
    }
  })

  return wordList.sort((a, b) => b[1] - a[1])
}

async function getStopwordLists(): Promise<string[]> {
  const english = fetch('/stopwords/english.txt')
  const german = fetch('/stopwords/german.txt')
  const custom = fetch('/stopwords/custom.txt')

  const results = await Promise.all([english, german, custom])
  const data = (await Promise.all(results.map((result) => result.text()))) as string[]
  return data.reduce((prev, text) => prev.concat(text.split(/\s+/g)), [] as string[])
}

function mergeWordLists(longList: Word[], shortList: Word[]): Word[] {
  const longListEntries = longList.map((wordTuple) => wordTuple[0])

  const mergedList = [...longList]
  shortList.forEach((wordTuple) => {
    const [word, count] = wordTuple
    const longListIndex = longListEntries.indexOf(word)
    if (longListIndex > -1) {
      mergedList[longListIndex][1] += count
    } else {
      mergedList.push(wordTuple)
    }
  })

  return mergedList
}
