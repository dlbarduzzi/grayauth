import { defineConfig } from "drizzle-kit"

import { env } from "@/lib/env"

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schemas/*",
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: { url: env.DATABASE_URL },
})
