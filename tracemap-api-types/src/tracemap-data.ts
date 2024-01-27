export interface Relations {
  followingRelations: [string, string][]
  handlesInDatabase: string[]
}

export interface CrawlStatus {
  handlesCrawled: string[]
}
