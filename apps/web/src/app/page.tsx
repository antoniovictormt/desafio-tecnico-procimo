import { use } from "react"
import { Chat } from "@/components/chat"
import { getInitialUser } from "@/lib/getInitialUser"

export default function Home() {
    const initialUser = use(getInitialUser())

    return (
        <main className="bg-muted flex h-screen w-screen items-center justify-center">
            <Chat initialUser={initialUser} />
        </main>
    )
}
