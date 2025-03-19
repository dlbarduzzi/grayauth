import { router as usersRouter } from "@/routes/users/handlers"
import { createApp } from "./core"

const app = createApp()
app.route("/api/v1/users", usersRouter)

export { app }
