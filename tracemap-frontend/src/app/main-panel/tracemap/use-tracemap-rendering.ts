import { useCallback } from 'react'
import {
  getCanvasXPosition,
  getCanvasYPosition,
  getOriginalXPosition,
  getOriginalYPosition,
  updatePositioning,
} from './use-tracemap-positions'
import { Relations } from 'tracemap-api-types'
import { createLinkList, getConnectionCount } from './graph-utilities'
import * as d3 from 'd3'

const colors = ['110,113,122', '127,37,230', '76,80,89']
const linkColors = ['204,208,217', '142,146,153']

interface Node {
  opacity: number
  color: number
  outDegree: number
  inDegree: number
  handle: string
}

export interface D3Node extends Node {
  cx: number
  cy: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  fx?: number
  fy?: number
}

export interface Link {
  source: string
  target: string
  opacity: number
  color: number
}

interface D3Link {
  source: D3Node
  target: D3Node
  opacity: number
  color: number
}

interface TracemapRenderingProps {
  canvasElem: HTMLCanvasElement | undefined
  inputData: Relations
  creatorHandle: string | undefined
}

export function useTracemapRendering({
  canvasElem,
  inputData,
  creatorHandle,
}: TracemapRenderingProps) {
  const initTracemap = useCallback(() => {
    if (typeof canvasElem === 'undefined' || typeof creatorHandle === 'undefined') {
      return
    }
    const creator = creatorHandle!
    const canvas = canvasElem!

    const dpr = devicePixelRatio || 1
    const ctx = canvas.getContext('2d')!

    const nodes: D3Node[] = []
    const links: Link[] = []

    function initGraph() {
      console.log('initiating graph')

      const d3scale = d3.scaleLinear().domain([2, 30]).range([8, 25])

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
          radius: d3scale(outDegree) * 1.6 * dpr,
          opacity: 1,
          color: 0,
          cx: 0,
          cy: 0,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
        })
      })

      pinSourceNode()

      const simulation = setSimulation()

      d3.select(canvas).call(
        d3
          .drag<HTMLCanvasElement, unknown>()
          .container(canvas)
          .subject((event) => getHoveredNode(event, simulation))
          .on('start', () => null)
          .on('drag', () => null)
          .on('end', () => null),
      )
    }

    function getHoveredNode(
      event: DragEvent,
      simulation: d3.Simulation<D3Node, D3Link>,
    ): Node | undefined {
      const x = getOriginalXPosition(event.x)
      const y = getOriginalYPosition(event.y)
      const node = simulation.find(x, y)
      if (node) {
        return simulation.find(x, y, node.radius * 1.2)
      }

      return undefined
    }

    function pinSourceNode() {
      const source = nodes.find((node) => node.inDegree === 0)!
      source.fx = 0
      source.fy = 0
    }

    function setSimulation(): d3.Simulation<D3Node, D3Link> {
      const simulation = d3
        .forceSimulation<D3Node, D3Link>(nodes)
        .force(
          'link',
          d3
            .forceLink<D3Node, D3Link>(links as unknown as D3Link[])
            .id((n) => (n as D3Node).handle)
            .distance((l) => {
              const source = l.source
              const target = l.target
              return source.radius + target.radius
            }),
        )
        .force(
          'charge',
          d3.forceManyBody<D3Node>().strength((n) => n.radius * (2 / (nodes.length / 10)) * -20),
        )
        .force(
          'collide',
          d3.forceCollide<D3Node>().radius((n) => n.radius * 1.5),
        )
        .on('tick', () => render())
      return simulation
    }

    function render() {
      console.log('render cicle')
      const scale = updatePositioning(nodes, canvas.width, canvas.height)
      nodes.forEach((node) => {
        node.cx = getCanvasXPosition(node.x)
        node.cy = getCanvasYPosition(node.y)
      })

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      links.forEach((link) => drawLink(link as unknown as D3Link, scale))
      nodes.forEach((node, i) => {
        if (i === 5) {
          node.color = 1
        }
        node.handle === creatorHandle ? drawAuthor(node, scale) : drawNode(node, scale)
      })
    }

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

    initGraph()
  }, [canvasElem, creatorHandle, inputData])

  return { initTracemap }
}
