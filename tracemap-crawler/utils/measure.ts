export class Measure {
  private startTime = Date.now()

  stop = () => {
    const endTime = Date.now()
    return endTime - this.startTime
  }
}
