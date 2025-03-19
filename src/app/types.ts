import type { Context } from "hono"
import type { Logger } from "winston"

export type AppEnv = {
  Variables: {
    logger: Logger
  }
}

export type AppContext = Context<AppEnv>
