import { Context } from 'koa'
import { crawlerDevServerUri, isLocalDevelopment } from '../../utils/config'
import { getAccessTokenHeader, getFullySpecifiedUserHandles } from '../../utils/request-params'
import axios, { AxiosError } from 'axios'

export async function requestCrawlingController(ctx: Context) {
  const accessToken = getAccessTokenHeader(ctx)
  const handles = getFullySpecifiedUserHandles(ctx)

  if (handles.length === 0) {
    ctx.status = 400
    ctx.message = 'no handles provided'
  }
  if (isLocalDevelopment === true) {
    try {
      const { data } = await axios.post(`${crawlerDevServerUri}/call-lambda-handler`, {
        accessToken,
        handles,
      })

      ctx.status = 200
      ctx.message = data.message
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        ctx.status = 500
        ctx.body = error
      }
    }
  }

  // TODO: send SNS Event when infrastructure is ready
}
