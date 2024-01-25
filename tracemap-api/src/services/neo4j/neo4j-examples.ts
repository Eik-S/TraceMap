import { Node, ServerInfo, auth, driver } from 'neo4j-driver'

const user = 'neo4j'
const password = 'neo4jdefault'
const db = driver('bolt://localhost:7687', auth.basic(user, password), {
  disableLosslessIntegers: true,
})

export async function getServerInfo(): Promise<ServerInfo> {
  return db.getServerInfo()
}

export async function getActorByName(name: string) {
  console.log(`searching for a person named ${name}`)
  const { records, summary, keys } = await db.executeQuery(
    'MATCH (p:Person {name: $name}) RETURN p',
    {
      name,
    },
  )

  return records[0].get(0)
}

export async function getActorsBirthYear(name: string) {
  const start = Date.now()
  const { records } = await measuredQuery(
    `MATCH (keanu:Person {name:'Keanu Reeves'})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(coActors:Person),
  (coActors:Person)-[:ACTED_IN]->(m2:Movie)<-[:ACTED_IN]-(cocoActors:Person)
WHERE NOT (keanu)-[:ACTED_IN]->()<-[:ACTED_IN]-(cocoActors) AND keanu <> cocoActors
RETURN cocoActors.name AS recommended, count(cocoActors) AS strength
ORDER BY strength DESC`,
    {
      name,
    },
  )

  return records.map((r) => ({
    recommended: r.get(0),
  }))
}

const measuredQuery: typeof db.executeQuery = async (query, p, c) => {
  const start = Date.now()
  const result = await db.executeQuery(query, p, c)
  const end = Date.now()
  const executionTime = end - start
  if (executionTime > 200) {
    console.error(`!!!!! warning !!!!!query took ${executionTime}ms to complete:`)
    console.error(query)
  }
  return result
}
