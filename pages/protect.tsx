
import { GetServerSideProps } from 'next'
import { getServerSession } from "next-auth/next"
import { signOut } from 'next-auth/react'
import { nextAuthOptions } from './api/auth/[...nextauth]'


export default function Protect({ credential }: { credential: { token: string, refresh_token: string } }) {
    // async function ambilsession() {
    //     const sss = await getSession()
    //     console.log(sss)
    // }

    // useEffect(() => {
    //     ambilsession()
    // }, [])
    console.log(credential)
    return (
        <div>
            <p> protect</p>
            <button onClick={() => signOut()}>Sign out</button>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, nextAuthOptions)

    if (session?.token === undefined || session.token === '') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {
            credential: {
                token: session.token,
                refresh_token: session.refresh_token
            },
        },
    }
}
