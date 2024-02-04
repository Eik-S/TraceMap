import { css } from '@emotion/react'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { Relations } from 'tracemap-api-types'
import { useStatusInfoContext } from '../../../contexts/status-info-context'
import { createLinkList, getConnectionCount } from './graph-utilities'

interface TracemapGraphProps {
  inputData: Relations
}

interface Node {
  opacity: number
  color: number
  outDegree: number
  inDegree: number
  radius: number
  handle: string
  cx: number
  cy: number
  fx?: number
  fy?: number
  x: number
  y: number
  vx?: number
  vy?: number
}

export interface Link {
  source: string
  target: string
  opacity: number
  color: number
}

interface RenderedLink {
  source: Node
  target: Node
  opacity: number
  color: number
}

export function TracemapGraph({ inputData, ...props }: TracemapGraphProps) {
  const { creatorHandle } = useStatusInfoContext()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const colors = ['110,113,122', '127,37,230', '76,80,89']
    const linkColors = ['204,208,217', '142,146,153']
    const creator = creatorHandle!
    const canvas = canvasRef.current!
    if (canvas == null || typeof creatorHandle === 'undefined') {
      return
    }

    const dpr = devicePixelRatio || 1
    const ctx = canvas.getContext('2d')!

    const nodes: Node[] = []
    const links: Link[] = []

    function initGraph() {
      const scale = d3.scaleLinear().domain([2, 30]).range([8, 25])
      console.log(dpr)

      // set canvas size respecting pixel ratio
      const width = canvas.clientWidth * dpr
      const height = canvas.clientHeight * dpr
      canvas.width = width
      canvas.height = height

      ctx.imageSmoothingEnabled = true
      ctx.translate(0.5, 0.5)

      createLinkList(inputData, creator).forEach((link) =>
        links.push({
          source: link[0],
          target: link[1],
          opacity: 1,
          color: 0,
        }),
      )

      inputData.handlesInDatabase.forEach((handle) => {
        const { inDegree, outDegree } = getConnectionCount(handle, links)
        nodes.push({
          handle,
          inDegree,
          outDegree,
          radius: scale(outDegree) * 1.6 * dpr,
          opacity: 1,
          color: 0,
          cx: 0,
          cy: 0,
          x: 0,
          y: 0,
        })
      })

      pinSourceNode()

      setSimulation()
    }

    function pinSourceNode() {
      console.log(nodes)
      const source = nodes.find((node) => node.inDegree === 0)!
      source.fx = 0
      source.fy = 0
    }

    function setSimulation(): d3.Simulation<Node, RenderedLink> {
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink(links as unknown as RenderedLink[])
            .id((n) => (n as Node).handle)
            .distance((l) => {
              const source = l.source
              const target = l.target
              return source.radius + target.radius
            }),
        )
        .force(
          'charge',
          d3.forceManyBody().strength((n) => (n as Node).radius * 2 * -20),
        )
        .force(
          'collide',
          d3.forceCollide().radius((n) => (n as Node).radius * 1.5),
        )
        .on('tick', () => render())
      return simulation
    }

    function render() {
      const scale = getScale()
      const shiftX = getShiftX()
      const shiftY = getShiftY()

      nodes.forEach((node) => {
        node.cx = getCanvasXPosition(node.x, scale, shiftX)
        node.cy = getCanvasYPosition(node.y, scale, shiftY)
      })

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      links.forEach((link) => drawLink(link as unknown as RenderedLink, scale))
      nodes.forEach((node) => {
        node.handle === creatorHandle ? drawAuthor(node, scale) : drawNode(node, scale)
      })
    }

    function getCanvasXPosition(x: number, scale: number, shiftX: number): number {
      return (x + shiftX) * scale + canvas.width / 2
    }

    function getCanvasYPosition(y: number, scale: number, shiftY: number): number {
      return (y + shiftY) * scale + canvas.height / 2
    }

    function drawLink(link: RenderedLink, scale: number) {
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
    }

    function drawNode(node: Node, scale: number) {
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

    function drawAuthor(node: Node, scale: number) {
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

    function getShiftX(): number {
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

    function getShiftY(): number {
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

    function getScale(): number {
      const xSpace = canvas.width
      const ySpace = canvas.height
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

    initGraph()
  }, [creatorHandle, inputData])

  function resizeCanvas() {}
  return <canvas css={styles.graph} ref={canvasRef} onResize={() => resizeCanvas()} {...props} />
}

const styles = {
  graph: css`
    width: 100%;
    height: 100%;
    padding: 20px;
  `,
}
