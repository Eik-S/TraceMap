import { Context, Next } from 'koa'

export class RequestError {
  statusCode = 500
  message = 'internal server error'
}

export class MissingParameterError extends RequestError {
  statusCode = 400
  message = 'required parameter missing'
}

export class SessionNotFoundError extends RequestError {
  statusCode = 401
  message = 'session not found'
}

export class SessionExpiredError extends RequestError {
  statusCode = 401
  message = 'session expired'
}
export class SessionNotPendingError extends RequestError {
  statusCode = 400
  message = 'session not pending'
}

export class InvalidStateIDError extends RequestError {
  statusCode = 403
  message = 'stateID provided does not match'
}

export class TwitterNotAuthorizedError extends RequestError {
  statusCode = 500
  message = 'Twitter Error: client not authorized'
}

export class TwitterApiLimitReachedError extends RequestError {
  statusCode = 500
  message = 'Twitter Error: api limit reached'
}

export class MastoRecordNotFoundError extends RequestError {
  statusCode = 404
  message = 'Mastodon Error: Record not Found'
}

export async function errorResponseMiddleware(ctx: Context, next: Next) {
  try {
    await next()
  } catch (error: any) {
    ctx.status = error.statusCode || 500
    ctx.body = { message: error.message || 'internal server error' }
  }
}
