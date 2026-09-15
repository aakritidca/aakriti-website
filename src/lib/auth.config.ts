import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config: no providers (Credentials pulls in bcryptjs +
// Prisma, which are Node-only and too heavy for the Edge Function size
// limit). Middleware only needs to decode/verify the signed JWT session
// cookie, which these callbacks alone are enough for. The full config
// with providers lives in auth.ts, imported only by code that runs on
// Node.js (API routes, server actions, server components).
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id as string;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
