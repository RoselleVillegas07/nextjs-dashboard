// auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    /**
     * This runs like middleware.
     * MUST return true or false only.
     * No redirect() here.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      // Protect dashboard
      if (isOnDashboard && !isLoggedIn) return false;

      // Allow everything else
      return true;
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        // 🔥 TEMP HARDCODED LOGIN (works immediately)
        const validEmail = "admin@example.com";
        const validPassword = "admin";

        if (
          credentials?.email === validEmail &&
          credentials?.password === validPassword
        ) {
          return {
            id: "1",
            name: "Admin",
            email: validEmail,
          };
        }

        // ❌ Wrong email/password
        return null;
      },
    }),
  ],
};

// Export NextAuth helpers
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
