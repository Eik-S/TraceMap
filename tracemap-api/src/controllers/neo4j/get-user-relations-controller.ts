import { Context } from 'koa'
import { ServerInfo } from 'neo4j-driver'
import { getUserRelations } from '../../services/neo4j/get-user-relations-service'
import { getFullySpecifiedUserHandles } from '../../utils/request-params'
import { Relations } from 'tracemap-api-types'

export async function getUserRelationsController(ctx: Context): Promise<Relations | void> {
  const handles = getFullySpecifiedUserHandles(ctx)
  const relations = await getUserRelations(handles)

  ctx.status = 200
  ctx.body = relations
}
