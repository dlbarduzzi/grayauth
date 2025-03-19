import { z } from "zod"
import bcrypt from "bcryptjs"

import { createRoute } from "@/app/core"
import { hasAppJsonHeader, errAppJsonHeader } from "@/app/utils"
import { StatusUnauthorized, StatusUnprocessableEntity } from "@/tools/http/status"

import { findUserByEmail, findPasswordByUserId } from "./queries"

const route = createRoute()

const signInSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .trim()
    .min(1, { message: "Email is required" })
    .email("Not a valid email"),
  password: z
    .string({ message: "Password is required" })
    .trim()
    .min(1, { message: "Password is required" }),
})

route.post("/", async ctx => {
  if (!hasAppJsonHeader(ctx.req.raw.headers)) {
    return errAppJsonHeader(ctx)
  }

  const body = await ctx.req.json()
  const parsed = signInSchema.safeParse(body)

  if (!parsed.success) {
    return ctx.json(
      {
        ok: false,
        error: StatusUnprocessableEntity.text,
        fields: parsed.error.flatten().fieldErrors,
      },
      StatusUnprocessableEntity.code
    )
  }

  const user = await findUserByEmail(parsed.data.email)
  if (user == null) {
    return ctx.json(
      { ok: false, error: StatusUnauthorized.text, details: "Invalid credentials" },
      StatusUnauthorized.code
    )
  }

  const password = await findPasswordByUserId(user.id)
  if (password == null) {
    return ctx.json(
      { ok: false, error: StatusUnauthorized.text, details: "Invalid credentials" },
      StatusUnauthorized.code
    )
  }

  const match = await bcrypt.compare(parsed.data.password, password.passwordHash)
  if (!match) {
    return ctx.json(
      { ok: false, error: StatusUnauthorized.text, details: "Invalid credentials 3" },
      StatusUnauthorized.code
    )
  }

  // TODO: Set cookie header!

  return ctx.json({ ok: true, user }, 200)
})

export { route }
