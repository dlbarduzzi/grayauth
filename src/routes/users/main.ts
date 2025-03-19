import { z } from "zod"
import { createRoute } from "@/app/core"
import { hasAppJsonHeader, errAppJsonHeader } from "@/app/utils"
import { StatusUnauthorized, StatusUnprocessableEntity } from "@/tools/http/status"

const users = createRoute()

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

users.post("/", async ctx => {
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

  function findUserByEmail(email: string) {
    if (email === "john@email.com") {
      return { id: "abcd-1234", email: "john@email.com" }
    }
    return null
  }

  const user = findUserByEmail(parsed.data.email)
  if (user == null) {
    return ctx.json(
      { ok: false, error: StatusUnauthorized.text, details: "Invalid credentials" },
      StatusUnauthorized.code
    )
  }

  function findPasswordByUserId(userId: string) {
    if (userId === "abcd-1234") {
      return "P@ssword!"
    }
    return null
  }

  const hashedPassword = findPasswordByUserId(user.id)
  if (hashedPassword == null) {
    return ctx.json(
      { ok: false, error: StatusUnauthorized.text, details: "Invalid credentials" },
      StatusUnauthorized.code
    )
  }

  function compare(password: string, hashedPassword: string) {
    return password === hashedPassword
  }

  if (!compare(parsed.data.password, hashedPassword)) {
    return ctx.json(
      { ok: false, error: StatusUnauthorized.text, details: "Invalid credentials" },
      StatusUnauthorized.code
    )
  }

  // TODO: Set cookie header!

  return ctx.json({ ok: true, user }, 200)
})

export { users }
