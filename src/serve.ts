import { serve } from "@hono/node-server"

import { env } from "@/app/env"
import { app } from "@/app/main"

serve(
  {
    fetch: app.fetch,
    port: env.APP_PORT,
  },
  info => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
