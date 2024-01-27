import cors from '@koa/cors'
import Router from '@koa/router'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import ServerlessHttp from 'serverless-http'
import { isLocalDevelopment } from './utils/config'
import { errorResponseMiddleware } from './utils/errors'
import { getClientIdController } from './controllers/oauth/get-client-id-controller'
import { getAccessTokenController } from './controllers/oauth/get-access-token-controller'
import { verifyAccessTokenController } from './controllers/oauth/verify-access-token-controller'
import { rebloggedByController } from './controllers/masto/reblogged-by-controller'
import { homeTimelineController } from './controllers/masto/home-timeline-controller'
import { requestCrawlingController } from './controllers/crawling/request-crawling-controller'
import { getUserRelationsController } from './controllers/neo4j/get-user-relations-controller'
import { getCrawlStatusController } from './controllers/neo4j/get-crawl-status-controller'

if (isLocalDevelopment) {
  dotenv.config()
}

const PORT = 3030

const server = new Koa()
const router = new Router()

router.get('/healthcheck', (ctx) => {
  ctx.status = 200
  ctx.message = 'OK'
})
router.get('/login/get-client-id', getClientIdController)
router.get('/login/get-access-token', getAccessTokenController)

router.get('/masto/verify-access-token', verifyAccessTokenController)
router.get('/masto/reblogged-by', rebloggedByController)
router.get('/masto/timelines/home', homeTimelineController)

router.post('/tracemap/request-crawling', requestCrawlingController)
router.post('/tracemap/get-user-relations', getUserRelationsController)
router.post('/tracemap/get-crawl-status', getCrawlStatusController)

if (isLocalDevelopment === false) {
  server.use(errorResponseMiddleware)
}
server.use(cors())
server.use(bodyParser())
server.use(router.routes())

console.log(`\n\n>\t TraceMap API running on http://localhost:${PORT}`)

// local dev server
if (isLocalDevelopment) {
  server.listen(PORT)
}

// lambda handler function
export const handler = ServerlessHttp(server)
