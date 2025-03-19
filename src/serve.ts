import { serve } from "@hono/node-server"

import { env } from "@/lib/env"
import { app } from "@/app/app"
import { logger } from "@/app/logger"

serve(
  {
    fetch: app.fetch,
    port: env.APP_PORT,
  },
  info => {
    logger.info("server started", { port: info.port })
  }
)
