import bcrypt from "bcryptjs"

import { createRoute } from "@/app/core"
import { getJsonPayload } from "@/app/request"

import {
  StatusOK,
  StatusBadRequest,
  StatusUnauthorized,
  StatusUnprocessableEntity,
} from "@/tools/http/status"

import { signInSchema } from "./schemas"
import { findUserByEmail, findPasswordByUserId } from "./queries"

const route = createRoute()

route.post("/", async ctx => {
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

  // TODO: Set cookie header!

  return ctx.json({ ok: true, user }, StatusOK.code)
})

export { route }
