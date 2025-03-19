import { z } from "zod"
import { config } from "dotenv"
import { expand } from "dotenv-expand"

expand(config())

const envSchema = z.object({
  NODE_ENV: z.enum(["test", "development", "production"]),
  APP_URL: z.string().url(),
  APP_PORT: z.coerce.number(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
  DATABASE_URL: z.string().url(),
})

// eslint-disable-next-line no-process-env
const envParsed = envSchema.safeParse(process.env)

if (!envParsed.success) {
  console.error("❌ Invalid server environment variables ❌")
  console.error(JSON.stringify(envParsed.error.flatten().fieldErrors, null, 2))
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

export const env = envParsed.data
