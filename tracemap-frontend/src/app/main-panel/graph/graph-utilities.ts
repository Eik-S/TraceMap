import { Relations } from 'tracemap-api-types'
import { Link } from './use-graph-rendering'

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
  const sharingHandlesByTime = data.handlesInDatabase

  const linkList: Relations['followingRelations'] = []

  data.followingRelations.forEach(([source, target]) => {
    const shareSource = target
    const shareTarget = source

    const shareSourceIndex = sharingHandlesByTime.indexOf(shareSource)
    const shareTargetIndex = sharingHandlesByTime.indexOf(shareTarget)

    if (shareSourceIndex < shareTargetIndex) {
      linkList.push([shareSource, shareTarget])
    }
  })

  // add links from creator to loose nodes not following another node
  const handlesFollowingSomebody = new Set(data.followingRelations.map(([source]) => source))
  data.handlesInDatabase.forEach((handle) => {
    if (handlesFollowingSomebody.has(handle) === false && handle !== creatorHandle) {
      linkList.push([creatorHandle, handle])
    }
  })

  return linkList
}

export function removeDuplicates(handles: string[]) {
  const handlesSet = new Set(handles)
  return Array.from(handlesSet)
}
