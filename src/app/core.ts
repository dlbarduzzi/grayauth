import type { AppEnv } from "./types"

import { Hono } from "hono"
import { requestId } from "hono/request-id"

import { logger } from "./logger"
import { StatusNotFound, StatusInternalServerError } from "@/tools/http/status"

export function createRoute() {
  return new Hono<AppEnv>({ strict: false })
}

export function createApp() {
  const app = createRoute()

  app.use(requestId())

  app.use("*", async (ctx, next) => {
    ctx.set("logger", logger)
    await next()
  })

  app.notFound(ctx => {
    return ctx.json(
      {
        ok: false,
        error: StatusNotFound.text,
        message: "The resource you are looking for does not exist",
      },
      StatusNotFound.code
    )
  })

  app.onError((err, ctx) => {
    console.error(err)
    return ctx.json(
      {
        ok: false,
        error: StatusInternalServerError.text,
        message: "Something went wrong while processing your request",
      },
      StatusInternalServerError.code
    )
  })

  return app
}
