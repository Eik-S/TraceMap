import { Context } from 'koa'

export function getServerQueryParam(ctx: Context): string {
  const serverQueryParam = ctx.query.server
  if (typeof serverQueryParam === 'undefined') {
    ctx.status = 400
    ctx.message = 'server query parameter missing'
  }

  return (serverQueryParam instanceof Array ? serverQueryParam[0] : serverQueryParam) as string
}

export function getStatusIDQueryParam(ctx: Context): string {
  const statusIDQueryParam = ctx.query.statusID
  if (typeof statusIDQueryParam === 'undefined') {
    ctx.status = 400
    ctx.message = 'statusID query parameter missing'
  }

  return (
    statusIDQueryParam instanceof Array ? statusIDQueryParam[0] : statusIDQueryParam
  ) as string
}

export function getAuthorizationCodeHeader(ctx: Context): string {
  const authorizationCodeHeader = ctx.headers['authorization-code']
  if (typeof authorizationCodeHeader === 'undefined') {
    ctx.status = 400
    ctx.message = 'Authorization-Code request header missing'
  }

  return (
    authorizationCodeHeader instanceof Array ? authorizationCodeHeader[0] : authorizationCodeHeader
  ) as string
}

export function getAccessTokenHeader(ctx: Context): string {
  const accessTokenHeader = ctx.headers['access-token']
  if (typeof accessTokenHeader === 'undefined') {
    ctx.status = 400
    ctx.message = 'Authorization-Code request header missing'
  }

  return (accessTokenHeader instanceof Array ? accessTokenHeader[0] : accessTokenHeader) as string
}
