export const isDev = process.env.NODE_ENV === 'development'
export const apiUrl = isDev ? 'http://localhost:3030' : 'https://tracemap.eikemu.com/api'
export const redirectUrl = isDev
  ? 'http://localhost:3000/login/callback'
  : 'https://tracemap.eikemu.com/login/callback'
