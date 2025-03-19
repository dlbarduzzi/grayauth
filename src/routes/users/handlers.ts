import bcrypt from "bcryptjs"
import { setCookie } from "hono/cookie"

import { createRouter } from "@/app/core"
import { getJsonPayload } from "@/app/request"

import {
  StatusOK,
  StatusBadRequest,
  StatusUnauthorized,
  StatusUnprocessableEntity,
} from "@/tools/http/status"

import { signInSchema } from "./schemas"
import { findUserByEmail, findPasswordByUserId } from "./queries"

const router = createRouter()

router.post("/sign-in", async ctx => {
  const { body, error } = await getJsonPayload(ctx)
  if (error != null) {
    return ctx.json(
      { ok: false, error: StatusBadRequest.text, details: error },
      StatusBadRequest.code
    )
  }

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
      { ok: false, error: StatusUnauthorized.text, details: "Invalid credentials" },
      StatusUnauthorized.code
    )
  }

  setCookie(ctx, "test_session_token", "test_1234", {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 10,
    sameSite: "lax",
    path: "/",
  })

  return ctx.json({ ok: true, user }, StatusOK.code)
})

export { router }
