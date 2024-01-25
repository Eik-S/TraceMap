import { Context } from 'koa'
import { getActorsBirthYear } from '../../services/neo4j/neo4j-examples'

export async function actorByNameController(ctx: Context) {
  const name = ctx.query.name
  const data = await getActorsBirthYear(name as string)

  ctx.status = 200
  ctx.body = data
}
