import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User extends DefaultUser {
        token: string,
        refresh_token: string,
        expires: number
    }
    interface Session extends DefaultSession {
        user: {
            token: string,
            refresh_token: string,
            expires: number
            error?: "RefreshAccessTokenError"
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        token: string,
        refresh_token: string,
        expires: number
        error?: "RefreshAccessTokenError"
    }
}
