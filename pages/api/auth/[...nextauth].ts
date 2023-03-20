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
                const response = await axios.post(`${baseUrl}/login`, {
                    email: credentials?.email,
                    password: credentials?.password
                })
                if (response.status >= 200 && response.status < 300) {
                    return { ...response.data, email: credentials?.email, name: credentials?.email }

                }
                return null
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.token = user.token
                token.refresh_token = user.refresh_token
            }
            return token
        },
        async session({ session, token, user }) {
            session.token = token.token ?? ''
            session.refresh_token = token.refresh_token ?? ''
            return session
        }
    }
}
export default NextAuth(nextAuthOptions)