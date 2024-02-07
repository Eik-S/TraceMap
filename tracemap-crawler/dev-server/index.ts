import cors from '@koa/cors'
import Router from '@koa/router'
import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import { handler } from '../src'
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
    handler(mockEvent)
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
