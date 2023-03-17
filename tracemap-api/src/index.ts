import Koa from 'koa'
import Router from '@koa/router'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { activateSessionController } from './controllers/activate-session-controller'
import { createSessionController } from './controllers/create-session-controller'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { restoreSessionController } from './controllers/restore-session-controller'
import { tweetInfoController } from './controllers/twitter/tweet-info-controller'
import ServerlessHttp from 'serverless-http'
import { isLocalDevelopment } from './utils/config'

if (isLocalDevelopment) {
  dotenv.config()
}

const PORT = 3030

const server = new Koa()
const router = new Router()

router.get('/login/create-session', createSessionController)
router.post('/login/activate-session', activateSessionController)
router.post('/login/restore-session', restoreSessionController)

router.post('/twitter/tweet-info', tweetInfoController)

server.use(cors())
server.use(bodyParser())
server.use(router.routes())

console.log(`\n\n>\t Koa Server running on http://localhost:${PORT}`)

// local dev server
if (isLocalDevelopment) {
  server.listen(PORT)
}

// lambda handler function
export const handler = ServerlessHttp(server)
