import { Hono } from "hono"
import { logger } from "hono/logger"
import { requestId } from "hono/request-id"

import {
  StatusNotFound,
  StatusUnprocessableEntity,
  StatusInternalServerError,
} from "@/tools/http/status"

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
        error: StatusNotFound.text,
        message: "The resource you are looking for does not exist",
      },
      StatusNotFound.code
    )
  })

  app.onError((err, ctx) => {
    if (err instanceof SyntaxError && err.message.toLowerCase().includes("json")) {
      return ctx.json(
        {
          ok: false,
          error: StatusUnprocessableEntity.text,
          message: "Malformed JSON in request body",
        },
        StatusUnprocessableEntity.code
      )
    }

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
