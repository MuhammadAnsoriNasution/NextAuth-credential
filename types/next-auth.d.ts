import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User extends DefaultUser {
        token: string,
        refresh_token: string
    }
    interface Session {
        user: {
            token: string,
            refresh_token: string
        } & DefaultSession["user"],
        token: string,
        refresh_token: string
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        token: string,
        refresh_token: string
    }
}
