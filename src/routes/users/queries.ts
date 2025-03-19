import { eq } from "drizzle-orm"
import { db } from "@/db/conn"
import { users } from "@/db/schemas/users"
import { passwords } from "@/db/schemas/passwords"
import { lowercase } from "@/lib/utils"

export async function findUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, lowercase(email.toLowerCase())),
  })
}

export async function findPasswordByUserId(userId: string) {
  return await db.query.passwords.findFirst({
    where: eq(passwords.userId, userId),
  })
}
