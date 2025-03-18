import { Hono } from "hono"
import { logger } from "hono/logger"
import { requestId } from "hono/request-id"

export function createRoute() {
  return new Hono({ strict: false })
}

export function createApp() {
  const app = createRoute()

  app.use(requestId())
  app.use(logger())

  app.notFound(ctx => {
    return ctx.json(
      {
        ok: false,
        error: "Not Found",
        message: "The resource you are looking for does not exist",
      },
      404
    )
  })

  app.onError((err, ctx) => {
    console.error(err)
    return ctx.json(
      {
        ok: false,
        error: "Server Error",
        message: "Something went wrong while processing your request",
      },
      500
    )
  })

  return app
}
