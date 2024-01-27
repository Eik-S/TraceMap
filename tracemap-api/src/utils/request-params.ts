import { Context } from 'koa'

export function getServerQueryParam(ctx: Context): string {
  const serverQueryParam = ctx.query.server
  if (typeof serverQueryParam === 'undefined') {
    ctx.status = 400
    ctx.message = 'server query parameter missing'
  }

  return (serverQueryParam instanceof Array ? serverQueryParam[0] : serverQueryParam) as string
}

export function getNextPageUrlQueryParam(ctx: Context): string | undefined {
  const serverQueryParam = ctx.query.nextPageUrl
  if (typeof serverQueryParam === 'undefined') {
    return undefined
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

export function getHandlesFromRequestBody(ctx: Context): string[] {
  const body = ctx.request.body
  const isObject = body instanceof Object
  const hasHandlesProperty = isObject && 'handles' in body
  if (hasHandlesProperty === false) {
    ctx.status = 400
    ctx.message = 'request body object must provide handles property'
    return []
  }

  const handles = body.handles
  if (isStringArray(handles) === false) {
    ctx.status = 400
    ctx.message = 'handles have to be of type string[]'
    return []
  }

  handles.forEach((handle) => {
    if (handle.indexOf('@') === -1) {
      ctx.status = 400
      ctx.message = 'all handles must be in format <username>@<server>'
    }
  })

  return handles as string[]
}

function isStringArray(input: any): input is string[] {
  const isArray = Array.isArray(input)
  return isArray && typeof input.find((val) => typeof val !== 'string') === 'undefined'
}
