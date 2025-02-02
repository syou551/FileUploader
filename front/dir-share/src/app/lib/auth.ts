import NextAuth from 'next-auth/next'
import type { NextAuthOptions, Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions : NextAuthOptions = {
    /*
    providers : [
        //add provider of support account type
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code"
              }
            }
        }),
    ],
    */
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: 'jwt'
    },
    /*
    callbacks: {
        async signIn({account, profile}:{account: Account | null; profile?: Profile | undefined;}){
            const isAccount = account && profile
            if (isAccount && account.provider === "google") {
                // return profile.email_verified && profile.email.endsWith("@example.com")
                return true
            }
            return true // Do different verification for other providers that don't have `email_verified`
        },
        jwt: ({token,user})=>{
            if(user){
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                };
            }
            return token;
        },
        session: ({session,token})=>{
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            };
        }
    },*/
    providers: [
        KeycloakProvider({
          clientId: process.env.NEXT_PUBLIC_KEYCLOAK_ID as string,
          clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_SECRET as string,
          issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
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
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);