export const isLocalDevelopment = process.env.NODE_ENV === 'development'

export const frontendBaseUri = isLocalDevelopment
  ? 'http://localhost:3000'
  : 'https://tracemap.eikemu.com'

export const oauthRedirectUri = isLocalDevelopment
  ? 'http://localhost:3000/login/callback'
  : 'https://tracemap.eikemu.com/login/callback'
