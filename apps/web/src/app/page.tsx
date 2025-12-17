import { Suspense } from "react"
import ChatWrapper from "@/components/chat/ChatWrapper"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
    return (
        <main className="bg-muted flex h-screen w-screen items-center justify-center">
            <Suspense
                fallback={<Skeleton className="h-96 w-full rounded-lg" />}
            >
                <ChatWrapper />
            </Suspense>
        </main>
    )
}
