
import NextAuth, { type AuthOptions, type SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
