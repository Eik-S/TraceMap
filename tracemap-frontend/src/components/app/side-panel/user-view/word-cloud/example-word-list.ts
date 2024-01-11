import { ListEntry } from 'wordcloud'

export const exampleWordList = [
  'Hello',
  'world',
  'normally',
  'you',
  'want',
  'more',
  'words',
  'than',
  'this',
  'you',
  'want',
  'more',
  'words',
  'than',
  'this',
]

export const exampleWordListWithSizes = exampleWordList
  .map((word) => [word, Math.floor(Math.random() * 15)])
  .sort((a, b) => {
    const aSize = a[1] as number
    const bSize = b[1] as number
    return bSize - aSize
  }) as ListEntry[]

export const wordListWeightFactor = 1000 / exampleWordListWithSizes[0][1]
