import { createRoute } from "@/app/core"

const users = createRoute()

users.get("/", ctx => {
  return ctx.json({ id: "123", name: "Brian Smith" }, 200)
})

export { users }
