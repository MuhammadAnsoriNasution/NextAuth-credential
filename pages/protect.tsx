
import { GetServerSideProps } from 'next'
import { getServerSession } from "next-auth/next"
import { signOut, useSession } from 'next-auth/react'
import { nextAuthOptions } from './api/auth/[...nextauth]'
import { useEffect } from 'react'


export default function Protect() {
    const { data: session } = useSession()

    const logout = async () => {
        const response = await signOut({ redirect: false })
    }

    useEffect(() => {
        if (session?.user.error === "RefreshAccessTokenError") {
            logout()
            window.location.reload()
        }
    }, [session]);

    return (
        <div>
            <p> protect</p>
            <button onClick={() => logout()}>Sign out</button>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, nextAuthOptions)

    if (session?.user.token === undefined || session.user.token === '') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {},
    }
}
