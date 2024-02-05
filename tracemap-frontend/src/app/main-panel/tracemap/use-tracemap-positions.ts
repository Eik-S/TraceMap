import { D3Node } from './use-tracemap-rendering'

let scale = 1
let shiftX = 0
let shiftY = 0

let width = 0
let height = 0
function calculateShiftX(nodes: D3Node[]): number {
  const sortByX = nodes
    .map((node) => {
      const nodeX = node.fx || node.x
      if (nodeX < 0) {
        return nodeX - node.radius
      }
      return nodeX + node.radius
    })
    .sort((a, b) => a - b)
  const xMin = sortByX[0]
  const xMax = sortByX[sortByX.length - 1]
  const shiftX = -((xMin + xMax) / 2)
  return shiftX
}

function calculateShiftY(nodes: D3Node[]): number {
  const sortByY = nodes
    .map((node) => {
      const nodeY = node.fy || node.y
      if (nodeY < 0) {
        return nodeY - node.radius
      }
      return nodeY + node.radius
    })
    .sort((a, b) => a - b)
  const yMin = sortByY[0]
  const yMax = sortByY[sortByY.length - 1]
  const shiftY = -((yMin + yMax) / 2)
  return shiftY
}

function calculateScale(nodes: D3Node[], xSpace: number, ySpace: number): number {
  const sortByX = nodes
    .map((node) => {
      const nodeX = node.fx || node.x
      if (nodeX < 0) {
        return nodeX - node.radius
      }
      return nodeX + node.radius
    })
    .sort((a, b) => a - b)
  const sortByY = nodes
    .map((node) => {
      const nodeY = node.fy || node.y
      if (nodeY < 0) {
        return nodeY - node.radius
      }
      return nodeY + node.radius
    })
    .sort((a, b) => a - b)
  const xMin = sortByX[0]
  const xMax = sortByX[sortByX.length - 1]
  const yMin = sortByY[0]
  const yMax = sortByY[sortByY.length - 1]
  const x = xMax - xMin
  const y = yMax - yMin
  const xFactor = xSpace / x
  const yFactor = ySpace / y
  const factor = Math.min(xFactor, yFactor)
  return Math.min(factor, 1)
}

export function updatePositioning(
  nodes: D3Node[],
  canvasWidth: number,
  canvasHeight: number,
): number {
  width = canvasWidth
  height = canvasHeight
  scale = calculateScale(nodes, canvasWidth, canvasHeight)
  shiftX = calculateShiftX(nodes)
  shiftY = calculateShiftY(nodes)

  return scale
}

export function getCanvasXPosition(x: number): number {
  return (x + shiftX) * scale + width / 2
}

export function getCanvasYPosition(y: number): number {
  return (y + shiftY) * scale + height / 2
}

export function getOriginalXPosition(x: number): number {
  return (x - width / 2) / scale - shiftX
}
export function getOriginalYPosition(y: number): number {
  return (y - height / 2) / scale - shiftY
}
