import cors from '@koa/cors'
import Router from '@koa/router'
import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import { handler } from '../src'
import { getUserMarkers } from '../src/neo4j-api/user-markers'
import { mockSQSEvent, mockSQSRecord } from './sqs-mock'

const PORT = 3031

const server = new Koa()
const router = new Router()

router.get('/healthcheck', (ctx) => {
  ctx.status = 200
  ctx.message = 'OK'
})
router.post('/call-lambda-handler', async (ctx: Context) => {
  const requestData = ctx.request.body
  try {
    const mockEvent = mockSQSEvent([mockSQSRecord(requestData)])
    void (await handler(mockEvent))
    ctx.status = 200
    ctx.message = 'crawled'
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message)
      ctx.status = 500
      ctx.message = error.message
      ctx.body = {
        data: requestData,
        error,
      }
    }
  }
})

router.get('/test', async (ctx: Context) => {
  const handlesParam = ctx.request.query.handles
  if (typeof handlesParam === 'undefined') {
    ctx.status = 400
    ctx.message = 'pass acct handles as ?handles query param'
    return
  }

  const handles = Array.isArray(handlesParam) ? handlesParam : [handlesParam]
  if (Array.isArray(handles)) {
    const result = await getUserMarkers(handles)
    ctx.status = 200
    ctx.body = result
  }
})

server.use(cors())
server.use(bodyParser())
server.use(router.routes())

if (process.env.LOG_LEVELLOG_LEVEL === 'info') {
  console.debug = () => null
}

if (process.env.LOG_LEVELLOG_LEVEL === 'error') {
  console.debug = () => null
  console.info = () => null
}

console.log(`\n\n>\t TraceMap-Crawler dev-API running on http://localhost:${PORT}`)

server.listen(PORT)
