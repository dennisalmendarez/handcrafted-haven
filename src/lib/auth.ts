import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { sql } from '@/lib/db';

type DbUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'seller' | 'customer';
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const users = await sql<DbUser[]>`
          SELECT id, name, email, password, role
          FROM users
          WHERE email = ${email}
          LIMIT 1
        `;

        const user = users[0];

        if (!user) {
          return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? '');
        session.user.role = String(token.role ?? '');
      }

      return session;
    },
  },
};