import { Status } from 'tracemap-api-types'
import { TimelineSort } from '../contexts/app-settings-context'
import { UnreachableCaseError } from './unreachable-case-error'

export function sortByUserSettings(statuses: Status[], sortBySettings: TimelineSort) {
  const sortedData = statuses.toSorted((a, b) => {
    switch (sortBySettings) {
      case 'time':
        return getCreationMillis(b) - getCreationMillis(a)
      case 'boosts':
        return getBoosts(b) - getBoosts(a)
      default:
        throw new UnreachableCaseError(sortBySettings)
    }
  })

  return sortedData
}

export function filterBoosts(statuses: Status[]): Status[] {
  return statuses.filter((status) => status.reblog === null)
}

function getBoosts(status: Status) {
  return status.reblog?.reblogs_count || status.reblogs_count
}

function getCreationMillis(status: Status) {
  const creationDateString = status.reblog?.created_at || status.created_at
  return new Date(creationDateString).getTime()
}
