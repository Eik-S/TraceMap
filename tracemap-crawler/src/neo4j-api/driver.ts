import { auth, driver } from 'neo4j-driver'

const user = 'neo4j'
const password = 'password123'
export const db = driver('bolt://localhost:7687', auth.basic(user, password), {
  disableLosslessIntegers: true,
})
