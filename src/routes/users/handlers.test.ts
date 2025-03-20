import type { Hono } from "hono"
import type { AppEnv } from "@/app/types"

import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

import { describe, it, expect, beforeAll, afterAll } from "vitest"

import { router } from "./handlers"
import { createApp } from "@/app/core"
import { lowercase } from "@/lib/utils"
import { StatusNotFound } from "@/tools/http/status"

import { db } from "@/db/conn"
import { users } from "@/db/schemas/users"
import { passwords } from "@/db/schemas/passwords"

function createTestApp(router: Hono<AppEnv>) {
  return createApp().route("/", router)
}

const testRouter = createTestApp(router)

describe("users.handlers", () => {
  // Use random string to create email to avoid database conflict
  // with other tests/files running in parallel where they also
  // create and delete database user records.
  const random = crypto.randomUUID().replaceAll("-", "")
  const testEmail = `${random}@test.com`
  const testPassword = "password"

  beforeAll(async () => {
    await db.transaction(async tx => {
      const [newUser] = await tx
        .insert(users)
        .values({ email: lowercase(testEmail) })
        .returning({ id: users.id })

      if (newUser == null) {
        return tx.rollback()
      }

      const passwordHash = await bcrypt.hash(testPassword, 12)

      const [newPassword] = await tx
        .insert(passwords)
        .values({ userId: newUser.id, passwordHash })
        .returning({ id: passwords.id })

      if (newPassword == null) {
        return tx.rollback()
      }
    })
  })

  afterAll(async () => {
    await db
      .delete(users)
      .where(eq(users.email, lowercase(testEmail)))
      .returning({ id: users.id })
  })

  it("should sign in user", async () => {
    const resp = await testRouter.request("/sign-in", {
      method: "POST",
      body: JSON.stringify({ email: testEmail, password: testPassword }),
      headers: new Headers({ "Content-Type": "application/json" }),
    })
    const result = await resp.json()
    expect(result).toHaveProperty("ok")
    expect(result).toHaveProperty("user")
    expect(result.user).toHaveProperty("id")
    expect(result.user.email).toBe(lowercase(testEmail))
    expect(resp.headers.get("x-request-id")).toBeDefined()
    expect(resp.headers.get("set-cookie")).toContain("test_session_token=test_1234")
  })
  it("should return not found error", async () => {
    const resp = await testRouter.request("/do-not-exist")
    const result = await resp.json()
    expect(resp.status).toBe(StatusNotFound.code)
    expect(result).toHaveProperty("error")
    expect(result.error).toBe(StatusNotFound.text)
  })
})
