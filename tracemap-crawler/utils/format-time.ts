export function makeMillisHumanReadable(millis: number): string {
  const secondsDivider = 1000
  const minutesDivider = 1000 * 60
  const hoursDivider = 1000 * 60 * 60
  if (millis > hoursDivider) {
    const hours = (millis / hoursDivider).toFixed(2)
    return `${hours}h`
  }
  if (millis > minutesDivider) {
    const minutes = (millis / minutesDivider).toFixed(1)
    return `${minutes}m`
  }
  if (millis > secondsDivider) {
    const seconds = (millis / secondsDivider).toFixed(1)
    return `${seconds}s`
  }
  return `${millis}ms`
}
