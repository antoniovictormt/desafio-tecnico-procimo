import { use } from "react"
import { cookies } from "next/headers"
import { Chat } from "@/components/chat"

async function getInitialUser() {
    const cookieStore = await cookies()
    const user = cookieStore.get("chat:user")?.value ?? null

    return user
}

export default function Home() {
    const initialUser = use(getInitialUser())

    return (
        <main className="bg-muted flex h-screen w-screen items-center justify-center">
            <Chat initialUser={initialUser} />
        </main>
    )
}
