import { createLogger, transports, format } from "winston"
import { env } from "@/lib/env"

export const logger = createLogger({
  level: env.LOG_LEVEL,
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
})
