import { D3Link, D3Node } from './use-graph-rendering'

const colors = ['110,113,122', '127,37,230', '76,80,89']
const linkColors = ['204,208,217', '142,146,153']

interface DrawUtilityProps {
  ctx: CanvasRenderingContext2D
  dpr: number
}

export function initGraphDrawing({ ctx, dpr }: DrawUtilityProps) {
  function drawLink(link: D3Link, scale: number) {
    const targetRadius = link.target.radius * scale
    const angle = Math.atan2(link.target.cy - link.source.cy, link.target.cx - link.source.cx)
    const xPos = link.target.cx - targetRadius * Math.cos(angle)
    const yPos = link.target.cy - targetRadius * Math.sin(angle)

    ctx.beginPath()
    ctx.moveTo(link.source.cx, link.source.cy)
    ctx.lineTo(xPos, yPos)
    ctx.strokeStyle = 'rgba(' + linkColors[link.color] + ',' + link.opacity + ')'
    ctx.lineWidth = 0.8 * dpr
    ctx.stroke()
    drawHead(link, xPos, yPos, angle)
  }

  function drawHead(link: D3Link, xPos: number, yPos: number, angle: number) {
    ctx.beginPath()
    ctx.moveTo(xPos, yPos)
    const headlen = 4 * dpr
    const headRightX = xPos - headlen * Math.cos(angle - Math.PI / 6)
    const headRightY = yPos - headlen * Math.sin(angle - Math.PI / 6)
    ctx.lineTo(headRightX, headRightY)
    ctx.moveTo(xPos, yPos)
    const headLeftX = xPos - headlen * Math.cos(angle + Math.PI / 6)
    const headLeftY = yPos - headlen * Math.sin(angle + Math.PI / 6)
    ctx.lineTo(headLeftX, headLeftY)
    ctx.strokeStyle = 'rgba(' + linkColors[1] + ',' + link.opacity + ')'
    ctx.lineWidth = 1 * dpr
    ctx.stroke()
  }

  function drawNode(node: D3Node, scale: number) {
    const lineWidth = 2 * scale
    const radius = node.radius * scale - lineWidth

    ctx.beginPath()
    ctx.arc(node.cx, node.cy, radius, 0, 2 * Math.PI)
    ctx.lineWidth = lineWidth
    ctx.fillStyle = 'rgba(' + colors[node.color] + ',' + node.opacity + ')'
    ctx.strokeStyle = '#F5F6F7'
    ctx.fill()
    ctx.stroke()
  }

  function drawAuthor(node: D3Node, scale: number) {
    const lineWidth = 2 * scale
    const radius = node.radius * scale - lineWidth
    const innerRadius = radius * 0.44

    ctx.beginPath()
    ctx.arc(node.cx, node.cy, radius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(' + colors[1] + ',' + node.opacity + ')'
    ctx.fill()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = '#F5F6F7'
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(node.cx, node.cy, innerRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
  }

  return {
    drawNode,
    drawAuthor,
    drawLink,
  }
}
