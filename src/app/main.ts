import { users } from "@/routes/users/main"
import { createApp } from "./core"

const app = createApp()
app.route("/api/v1/users", users)

export { app }
