import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(getStoredValue(key) ?? initialValue)

  function getStoredValue(key: string): T | undefined {
    if (typeof window === 'undefined') {
      return
    }
    const storedValue = window.localStorage.getItem(key)
    if (storedValue) {
      return JSON.parse(storedValue)
    } else {
      return undefined
    }
  }

  useEffect(() => {
    const item = window.localStorage.getItem(key)
    if (item) {
      setStoredValue(JSON.parse(item))
    }
  }, [key])

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue))
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
