import { css } from '@emotion/react'
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
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
  const [scale] = useState(1)
  const [shiftX] = useState(0)
  const [shiftY] = useState(0)
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

      // get drawing context and move to its center
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
      const node = nodes[1]
      const link = links[1]
      console.log({ x: node.x, y: node.y, node })
      console.log({ link })

      nodes.forEach((node) => {
        node.cx = getCanvasXPosition(node.x)
        node.cy = getCanvasYPosition(node.y)
      })

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      links.forEach((link) => drawLink(link as unknown as RenderedLink))
      nodes.forEach(drawNode)
    }

    function getCanvasXPosition(x: number): number {
      return (x + shiftX) * scale + canvas.width / 2
    }

    function getCanvasYPosition(y: number): number {
      return (y + shiftY) * scale + canvas.height / 2
    }

    function drawLink(link: RenderedLink) {
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

    function drawNode(node: Node) {
      const lineWidth = 2 * scale
      const radius = node.radius * scale - lineWidth
      ctx.beginPath()
      ctx.moveTo(node.cx + radius, node.cy)
      ctx.arc(node.cx, node.cy, radius, 0, 2 * Math.PI)
      ctx.lineWidth = lineWidth
      ctx.fillStyle = 'rgba(' + colors[node.color] + ',' + node.opacity + ')'
      ctx.strokeStyle = '#F5F6F7'
      ctx.fill()
      ctx.stroke()
    }

    initGraph()
  }, [creatorHandle, inputData, scale, shiftX, shiftY])

  function resizeCanvas() {}
  return <canvas css={styles.graph} ref={canvasRef} onResize={() => resizeCanvas()} {...props} />
}

const styles = {
  graph: css`
    width: 100%;
    height: 100%;
  `,
}
