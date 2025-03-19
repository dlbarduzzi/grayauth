import type { AppContext } from "./types"

const appJsonRegex = /^application\/([a-z-.]+\+)?json(;\s*[a-zA-Z0-9-]+=([^;]+))*$/

export async function getJsonPayload(ctx: AppContext) {
  const headers = ctx.req.raw.headers
  const appJsonValue = headers.get("Content-Type") || headers.get("content-type")
  if (appJsonValue == null) {
    return { error: "Missing 'Content-Type:application/json' HTTP header" }
  }
  if (!appJsonRegex.test(appJsonValue)) {
    return { error: "Missing 'Content-Type:application/json' HTTP header" }
  }
  try {
    return { body: await ctx.req.json() }
  } catch (e) {
    let message = ""
    switch (true) {
      case e instanceof SyntaxError:
        // Don't need to log message. User error.
        break
      case e instanceof Error:
        message = e.message
        break
      default:
        message = "Uncaught error"
        break
    }
    if (message !== "") {
      ctx.var.logger.error("json payload failed to read body", { error: message })
    }
    return { error: "Malformed JSON in request body" }
  }
}
