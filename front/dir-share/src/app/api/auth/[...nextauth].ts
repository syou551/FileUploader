import NextAuth, { Account, NextAuthOptions, Profile } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions:  NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  callbacks: {
    async signIn({account, profile}:{account: Account | null; profile?: Profile | undefined;}){
        const isAccount = account && profile
        if (isAccount && account.provider === "keycloak") {
            // return profile.email_verified && profile.email.endsWith("@example.com")
            return true
        }
        return true // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
};

export default NextAuth(authOptions)