import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"

import { env } from "@/lib/env"
import { users, userRelations } from "@/db/schemas/users"
import { passwords, passwordRelations } from "@/db/schemas/passwords"

const schema = { users, userRelations, passwords, passwordRelations }

const client = postgres(env.DATABASE_URL)
const connect = drizzle({ client, schema })

export const db = connect
