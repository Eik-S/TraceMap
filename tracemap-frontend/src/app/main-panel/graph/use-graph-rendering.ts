import * as d3 from 'd3'
import { useCallback } from 'react'
import { Relations } from 'tracemap-api-types'
import { initGraphDrawing } from './graph-drawing'
import {
  getCanvasXPosition,
  getCanvasYPosition,
  getOriginalXPosition,
  getOriginalYPosition,
  updatePositioning,
} from './graph-positions'
import { createLinkList, getConnectionCount, removeDuplicates } from './graph-utilities'

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

export interface D3Link {
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

export function useGraphRendering({
  canvasElem,
  inputData,
  creatorHandle,
}: TracemapRenderingProps) {
  const initTracemap = useCallback(() => {
    if (typeof canvasElem === 'undefined' || typeof creatorHandle === 'undefined') {
      return
    }

    const creator = creatorHandle
    const canvas = canvasElem

    const dpr = devicePixelRatio || 1
    const d3scale = d3.scaleLinear().domain([2, 30]).range([8, 25])

    const ctx = canvas.getContext('2d')!
    const { drawAuthor, drawLink, drawNode } = initGraphDrawing({ ctx, dpr })

    let dragging = false

    const links: Link[] = createLinkList(inputData, creator).map((link) => ({
      source: link[0],
      target: link[1],
      opacity: 1,
      color: 0,
    }))

    const nodes: D3Node[] = removeDuplicates(inputData.handlesInDatabase).map((handle) => {
      const { inDegree, outDegree } = getConnectionCount(handle, links)
      return {
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
      }
    })

    function initGraph() {
      console.log('initiating graph')

      // set canvas size respecting pixel ratio
      const width = canvas.clientWidth * dpr
      const height = canvas.clientHeight * dpr
      canvas.width = width
      canvas.height = height

      ctx.imageSmoothingEnabled = true
      ctx.translate(0.5, 0.5)

      pinSourceNode()

      const simulation = createSimulation()

      d3.select(canvas).call(
        d3
          .drag<HTMLCanvasElement, any>()
          .container(canvas)
          .subject((event) => getHoveredNode(event, simulation))
          .on('start', (event) => dragNodeStart(event, simulation))
          .on('drag', dragNodeDrag)
          .on('end', (event) => dragNodeEnd(event, simulation)),
      )
    }

    function dragNodeStart(
      event: d3.D3DragEvent<any, D3Node, D3Node>,
      simulation: d3.Simulation<D3Node, D3Link>,
    ) {
      dragging = true
      if (simulation.alpha < simulation.alphaMin) {
        simulation.alphaTarget(0.3).restart()
      }
      const node = event.subject
      node.fx = node.x
      node.fy = node.y
    }

    function dragNodeDrag(event: d3.D3DragEvent<any, D3Node, D3Node>) {
      const node = event.subject
      node.fx = event.x
      node.fy = event.y
    }

    function dragNodeEnd(
      event: d3.D3DragEvent<any, D3Node, D3Node>,
      simulation: d3.Simulation<D3Node, D3Link>,
    ) {
      dragging = false
      simulation.alphaTarget(0)
      const node = event.subject
      node.fx = undefined
      node.fy = undefined
    }

    function createSimulation(): d3.Simulation<D3Node, D3Link> {
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
          d3.forceManyBody<D3Node>().strength((n) => n.radius * (4 / (nodes.length / 10)) * -20),
        )
        .force(
          'collide',
          d3.forceCollide<D3Node>().radius((n) => n.radius * 1.5),
        )
        .on('tick', () => render())

      return simulation
    }

    function getHoveredNode(
      event: DragEvent,
      simulation: d3.Simulation<D3Node, D3Link>,
    ): Node | undefined {
      const x = getOriginalXPosition(event.x * dpr)
      const y = getOriginalYPosition(event.y * dpr)
      const node = simulation.find(x, y)
      if (node) {
        const nodeClicked = simulation.find(x, y, node.radius * 1.2)
        return nodeClicked
      }

      return undefined
    }

    function pinSourceNode() {
      const source = nodes.find((node) => node.inDegree === 0)
      if (typeof source === 'undefined') {
        return
      }

      source.fx = 0
      source.fy = 0
    }

    function render() {
      const scale = updatePositioning(nodes, canvas.width, canvas.height, dragging)
      nodes.forEach((node) => {
        node.cx = getCanvasXPosition(node.x)
        node.cy = getCanvasYPosition(node.y)
      })

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      links.forEach((link) => drawLink(link as unknown as D3Link, scale))
      nodes.forEach((node, i) => {
        node.handle === creatorHandle ? drawAuthor(node, scale) : drawNode(node, scale)
      })
    }

    initGraph()
  }, [canvasElem, creatorHandle, inputData])

  return { initTracemap }
}
