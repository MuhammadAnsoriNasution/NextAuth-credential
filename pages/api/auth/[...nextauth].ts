import axios from "axios"
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const baseUrl = process.env.REACT_APP_API

export const nextAuthOptions: NextAuthOptions = {

    providers: [
        Credentials({
            id: "credential",
            name: 'Credential',
            type: "credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "jsmith", required: true },
                password: { label: "Password", type: "password", required: true }
            },
            async authorize(credentials, req) {
                try {
                    const response = await axios.post(`${baseUrl}/login`, {
                        email: credentials?.email,
                        password: credentials?.password
                    })
                    if (response.status >= 200 && response.status < 300) {
                        var expires_in = new Date();
                        const time = Math.floor(response.data.expires_in / 60)
                        expires_in.setMinutes(expires_in.getMinutes() + time);

                        return {
                            ...response.data,
                            token: response.data.token,
                            refresh_token: response.data.refresh_token,
                            expires: expires_in.getTime(),
                        }
                    }
                    return null
                } catch (error: any) {
                    throw new Error(JSON.stringify({
                        statusCode: error.response.status,
                        data: error.response.data
                    }))
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.token = user.token
                token.refresh_token = user.refresh_token
                token.expires = user.expires
                return token
            } else if (new Date().getTime() < token.expires) {
                return token
            } else {
                try {
                    const response = await axios.post("/refresh-token", { refresh_token: token.refresh_token })
                    if (response.status >= 200 && response.status < 300) {
                        var expires_in = new Date();
                        const time = Math.floor(response.data.expires_in / 60)
                        expires_in.setMinutes(expires_in.getMinutes() + time);
                        return {
                            ...response.data,
                            token: response.data.token,
                            refresh_token: response.data.refresh_token,
                            expires: expires_in.getTime(),
                        }
                    }
                    return { ...token, error: "RefreshAccessTokenError" as const }
                } catch (error: any) {
                    return { ...token, error: "RefreshAccessTokenError" as const }
                }
            }

        },
        async session({ session, token, user }) {
            session.user = token
            return session
        }
    }
}
export default NextAuth(nextAuthOptions)