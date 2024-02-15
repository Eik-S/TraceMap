import { ReactNode, createContext, useContext, useState } from 'react'

export type TimelineSort = 'time' | 'boosts'

function useGraphStatus() {
  const [graphStatus, setGraphStatus] = useState<'off' | 'loading' | 'generating' | 'ready'>('off')
  return {
    graphStatus,
    setGraphStatus,
  }
}

const GraphStatusContext = createContext<ReturnType<typeof useGraphStatus> | undefined>(undefined)

export function GraphStatusProvider({ children }: { children: ReactNode }) {
  const graphStatus = useGraphStatus()

  return <GraphStatusContext.Provider value={graphStatus}>{children}</GraphStatusContext.Provider>
}

export function useGraphStatusContext() {
  const context = useContext(GraphStatusContext)
  if (context === undefined) {
    throw new Error('useGraphStatusContext must be used within a GraphStatusProvider')
  }
  return context
}
