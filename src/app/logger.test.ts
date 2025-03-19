import { describe, it, expect } from "vitest"

import { Logger } from "winston"
import { logger } from "./logger"

describe("logger", () => {
  it("should return an instance of winston logger", async () => {
    expect(logger).toBeInstanceOf(Logger)
  })
})
