import { sql } from "@/lib/db"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json()

  // check if user exists
  const existing = await sql`
    SELECT * FROM users WHERE email = ${email}
  `

  if (existing.length > 0) {
    return Response.json({ error: "User already exists" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await sql`
    INSERT INTO users (id, name, email, password, role)
    VALUES (${crypto.randomUUID()}, ${name}, ${email}, ${hashedPassword}, ${role})
  `

  return Response.json({ message: "User created" })
}