import NextAuth from 'next-auth/next'
import type { NextAuthOptions, Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions : NextAuthOptions = {
    
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

        KeycloakProvider({
            clientId: process.env.NEXT_PUBLIC_KEYCLOAK_ID!,
            clientSecret: process.env.NEXT_PUBLIC_KEYCLOAK_SECRET!,
            issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER!,
          }),
    ],
    
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
    callbacks: {
        async jwt({ token, user, account, profile, }) {
            if (account) {
              token.user = {
                ...user
              }
            }
            return token;
        },
        async session({ session, token, user }) {
            session.user = token.user as authSession;
            return session;
        },
    },
}

interface authSession{
    name?: string | null,
    email?: string | null,
    image?: string | null,
    scope?: any | null
}

const decode = function (token : string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);