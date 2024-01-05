import axios from 'axios'
import {
  getAppCredentialsFromDynamo,
  saveAppCredentialsToDynamo,
} from '../dynamo/dynamo-app-credentials'

export async function getClientId(server: string, forceUpdate = false): Promise<string> {
  const storedCredentials = await getAppCredentialsFromDynamo(server)

  if (typeof storedCredentials === 'undefined' || forceUpdate === true) {
    console.log(`creating new app credentials for ${server}`)
    const newCredentials = await createAppCredentials(server)

    void (await saveAppCredentialsToDynamo(server, newCredentials))

    return newCredentials.client_id
  }

  console.log(`returning stored app credentials for ${server}`)
  return storedCredentials.client_id
}

interface AppCredentialsResponse {
  id: string
  name: string
  website: string
  redirect_uri: string
  client_id: string
  client_secret: string
  vapid_key: string
}

export interface MastoErrorResponse {
  error: string
  error_description?: string
}

async function createAppCredentials(server: string): Promise<AppCredentialsResponse> {
  const response = await axios.post<AppCredentialsResponse | MastoErrorResponse>(
    `https://${server}/api/v1/apps`,
    {
      client_name: 'Tracemap',
      redirect_uris:
        'https://tracemap.eikemu.com/login/callback\nhttp://localhost:3000/login/callback',
      scopes: 'read',
      website: 'https://tracemap.eikemu.com',
    },
  )

  if (isErrorResponse(response.data)) {
    throw new Error(response.data.error)
  }

  return response.data
}

export function isErrorResponse<T>(data: T | MastoErrorResponse): data is MastoErrorResponse {
  return typeof data === 'object' && data !== null && data.hasOwnProperty('error')
}
