import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sql } from "@/lib/db"
import bcrypt from "bcrypt"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
  name: "Credentials",

  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" }
  },

  async authorize(credentials) {
    if (!credentials) return null

    const email = credentials.email
    const password = credentials.password

    if (!email || !password) return null

        const users = await sql`
          SELECT * FROM users WHERE email = ${email}
        `

        const user = users[0]

        if (!user) return null

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return null

        return {
          id: user.id,
          email: user.email
        }
      }
    })
  ],

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/signin"
  }
})

export { handler as GET, handler as POST }