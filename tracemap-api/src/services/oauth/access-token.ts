import axios, { AxiosError } from 'axios'
import { oauthRedirectUri } from '../../utils/config'
import { MastoErrorResponse, isErrorResponse } from './client-id'
import { getAppCredentialsFromDynamo } from '../dynamo/dynamo-app-credentials'

/**
 *
 * @param server the servers address e.g. mastodon.social
 * @param code the users authorization_code generated clientside
 * @returns the users access_token for future mastodon api requests
 */
export async function getAccessToken(server: string, code: string): Promise<string | undefined> {
  const credentials = await getAppCredentialsFromDynamo(server)

  if (typeof credentials === 'undefined') {
    throw new Error(`no app credentials found for server ${server}`)
  }

  const { client_id, client_secret } = credentials
  const response = await requestAccessToken({
    client_id,
    client_secret,
    server,
    code,
  })

  if (isErrorResponse(response)) {
    return undefined
  }

  return response.access_token
}

interface RequestAccessTokenParams {
  server: string
  client_id: string
  client_secret: string
  code: string
}

interface RequestAccessTokenResponse {
  access_token: string
  token_type: 'Bearer'
  scope: string
  created_at: number
}

async function requestAccessToken({
  server,
  client_id,
  client_secret,
  code,
}: RequestAccessTokenParams): Promise<RequestAccessTokenResponse | MastoErrorResponse> {
  try {
    const response = await axios.post<RequestAccessTokenResponse | MastoErrorResponse>(
      `https://${server}/oauth/token`,
      {
        client_id,
        client_secret,
        redirect_uri: oauthRedirectUri,
        grant_type: 'authorization_code',
        code,
        scope: 'read',
      },
    )

    return response.data
  } catch (error: unknown) {
    return {
      error: 'axios error',
      error_description: error instanceof AxiosError ? error.message : '',
    }
  }
}
