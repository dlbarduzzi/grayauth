import { route as users } from "@/routes/users/handlers"
import { createApp } from "./core"

const app = createApp()
app.route("/api/v1/users", users)

export { app }
