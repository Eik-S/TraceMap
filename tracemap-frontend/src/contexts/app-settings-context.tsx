import { ReactNode, createContext, useContext } from 'react'
import { useLocalStorage } from '../utils/use-local-storage'

export type TimelineSort = 'time' | 'boosts'

function useAppSettings() {
  const [sortTimelineBy, setSortTimelineBy] = useLocalStorage<TimelineSort>(
    'user-settings_sort-timeline-by',
    'time',
  )
  const [showBoosts, setShowBoosts] = useLocalStorage<boolean>('user-settings_show-boosts', true)

  return {
    sortTimelineBy,
    setSortTimelineBy,
    showBoosts,
    setShowBoosts,
  }
}

const AppSettingsContext = createContext<ReturnType<typeof useAppSettings> | undefined>(undefined)

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const appSettings = useAppSettings()

  return <AppSettingsContext.Provider value={appSettings}>{children}</AppSettingsContext.Provider>
}

export function useAppSettingsContext() {
  const context = useContext(AppSettingsContext)
  if (context === undefined) {
    throw new Error('useTracemapUserContext must be used within a TracemapUserProvider')
  }
  return context
}
