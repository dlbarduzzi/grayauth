import { z } from "zod"

export const signInSchema = z.object({
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
