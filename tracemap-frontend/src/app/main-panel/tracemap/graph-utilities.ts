import { Relations } from 'tracemap-api-types'
import { Link } from './use-tracemap-rendering'

export function getConnectionCount(
  handle: string,
  links: Link[],
): { outDegree: number; inDegree: number } {
  const outDegree = links.filter((link) => link.source === handle).length
  const inDegree = links.filter((link) => link.target === handle).length

  return {
    outDegree,
    inDegree,
  }
}

export function createLinkList(
  data: Relations,
  creatorHandle: string,
): Relations['followingRelations'] {
  const linkList: Relations['followingRelations'] = data.followingRelations
    .filter(([source]) => source !== creatorHandle)
    .map(([source, target]) => [target, source])

  // add links from creator to loose nodes not following another node
  const handlesFollowingSomebody = new Set(data.followingRelations.map(([source]) => source))
  data.handlesInDatabase.forEach((handle) => {
    if (handlesFollowingSomebody.has(handle) === false && handle !== creatorHandle) {
      linkList.push([creatorHandle, handle])
    }
  })

  return linkList
}
