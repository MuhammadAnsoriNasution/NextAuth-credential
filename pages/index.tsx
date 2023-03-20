import { signIn, useSession } from "next-auth/react"
import Link from "next/link"


export default function Index() {

  return (
    <div>
      <Link href={'/protect'}>Protect</Link>
      <button onClick={() => signIn()}>Sign in</button>

    </div>
  )
}

