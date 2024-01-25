import { Context } from 'koa'
import { getServerInfo } from '../../services/neo4j/neo4j-examples'
import { ServerInfo } from 'neo4j-driver'

export async function neo4jServerInfoController(ctx: Context): Promise<ServerInfo | void> {
  const info = await getServerInfo()

  ctx.status = 200
  ctx.body = info
}
