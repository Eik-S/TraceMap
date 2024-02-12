import { AppCredentials } from './dynamo-app-credentials'
import * as fs from 'fs'

export const getLocalAppCredentials = (): AppCredentials | undefined => {
  const client_id = process.env.mastodon_client_id
  const client_secret = process.env.mastodon_client_secret

  if (typeof client_id === 'undefined' || typeof client_secret === 'undefined') {
    return undefined
  }

  return {
    client_id,
    client_secret,
  }
}

export const saveLocalAppCredentials = (credentials: AppCredentials) => {
  const envPath = '.env'
  fs.writeFileSync(
    envPath,
    `mastodon_client_id=${credentials.client_id}\nmastodon_client_secret=${credentials.client_secret}`,
  )

  process.env.mastodon_client_id = credentials.client_id
  process.env.mastodon_client_secret = credentials.client_secret
}
