import type { Context } from "hono"
import { StatusUnprocessableEntity } from "@/tools/http/status"

const appJsonHeaderName = "content-type"
const appJsonHeaderValue = "application/json"

export function hasAppJsonHeader(headers: Headers) {
  const appJson = (headers.get(appJsonHeaderName) ?? "").trim()
  return appJson === appJsonHeaderValue
}

export function errAppJsonHeader(ctx: Context) {
  return ctx.json(
    {
      ok: false,
      error: StatusUnprocessableEntity.text,
      details: `HTTP header '${appJsonHeaderName}:${appJsonHeaderValue}' is required`,
    },
    StatusUnprocessableEntity.code
  )
}
