import { AccessOAuth2TokenArgs, TwitterApi } from 'twitter-api-v2'
import { frontendBaseUri } from '../utils/config'
import { decrypt } from './data/secrets-manager'

export const redirectUri = `${frontendBaseUri}/login/callback`

async function createAppClient() {
  const clientId = await decrypt(process.env.twitter_client_id_encrypted!)
  const clientSecret = await decrypt(process.env.twitter_client_secret_encrypted!)
  const client = new TwitterApi({
    clientId,
    clientSecret,
  })
  return client
}

export async function requestOauthLink() {
  const client = await createAppClient()

  return client.generateOAuth2AuthLink(redirectUri, {
    scope: ['tweet.read', 'users.read', 'follows.read', 'offline.access'],
  })
}

export async function requestUserAccessToken({
  code,
  codeVerifier,
  redirectUri,
}: AccessOAuth2TokenArgs) {
  const client = await createAppClient()

  return client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri,
  })
}
