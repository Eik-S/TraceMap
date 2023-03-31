import { Context, Next } from 'koa'

export class RequestError {
  statusCode = 500
  message = 'internal server error'
}

export class MissingParameterError implements RequestError {
  statusCode = 400
  message = 'required parameter missing'
}

export class SessionNotFoundError implements RequestError {
  statusCode = 401
  message = 'session not found'
}

export class SessionExpiredError implements RequestError {
  statusCode = 401
  message = 'session expired'
}
export class SessionNotPendingError implements RequestError {
  statusCode = 400
  message = 'session not pending'
}

export class InvalidStateIDError implements RequestError {
  statusCode = 403
  message = 'stateID provided does not match'
}

export class TwitterNotAuthorizedError implements RequestError {
  statusCode = 500
  message = 'Twitter Error: client not authorized'
}

export class TwitterApiLimitReachedError implements RequestError {
  statusCode = 500
  message = 'Twitter Error: api limit reached'
}

export async function errorResponseMiddleware(ctx: Context, next: Next) {
  try {
    await next()
  } catch (err) {
    if (err instanceof RequestError) {
      ctx.status = err.statusCode
      ctx.body = {
        message: err.message,
      }
    }

    throw err
  }
}
