import { AccessOAuth2TokenArgs, TwitterApi } from 'twitter-api-v2'

export const redirectUri = 'http://localhost:3000/login/callback'

function createAppClient() {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
  })
  return client
}

export async function requestOauthLink() {
  const client = createAppClient()

  return client.generateOAuth2AuthLink(redirectUri, {
    scope: ['tweet.read', 'users.read', 'follows.read', 'offline.access'],
  })
}

export async function requestUserAccessToken({
  code,
  codeVerifier,
  redirectUri,
}: AccessOAuth2TokenArgs) {
  const client = createAppClient()

  return client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri,
  })
}
