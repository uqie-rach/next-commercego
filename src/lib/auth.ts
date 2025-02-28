
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt-ts'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { findUserByEmail } from './mongo/user'
import { prisma } from './mongo/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId as string,
      clientSecret: getGoogleCredentials().clientSecret as string,
    }),
    CredentialProvider({
      name: "Email and Password",
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "yourfinestaccount@gmail.com"
        },
        password: {
          type: "password",
          label: "Password",
        },
      },
      authorize: async function (credentials) {
        console.log('[auth.ts] credentials', credentials)
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await findUserByEmail(credentials.email); // Ambil user dari database
        if (!user) {
          return null;
        }

        const isValidPassword = await compare(credentials.password, user.password!);
        if (!isValidPassword) {
          return null;
        }

        console.log("User found", user);
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    jwt: async ({ token, user }) => {

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role; // Tambahkan role ke token
      }

      return token;
    },
    session: async ({ session, token }) => {

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Tambahkan role ke session
      }
      return session;
    },
    redirect: async () => {
      return '/dashboard'
    }
  },
}

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || clientId.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET')
  }

  return { clientId, clientSecret }
}
