"use client"

import { Button } from "@/components/ui/button"
import { LoginModal } from "../login-modal"
import { ChatForm } from "./form"
import { ChatMessages } from "./messages"
import { useChat } from "@/hooks/useChat"
import { LogOut } from "lucide-react"

export function Chat({ initialUser }: { initialUser: string | null }) {
    const { messages, setUser, user, logout } = useChat({
        initialUser
    })

    return (
        <>
            <LoginModal open={!user} onLogin={setUser} />

            <div className="bg-background flex h-11/12 w-11/12 flex-col rounded-lg">
                <header className="flex items-center justify-between border-b px-4 py-3">
                    <span className="font-semibold">{user}</span>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut />
                    </Button>
                </header>

                <div className="flex-1 overflow-hidden">
                    <ChatMessages messages={messages} currentUser={user} />
                </div>

                <footer className="border-t p-3">
                    <ChatForm />
                </footer>
            </div>
        </>
    )
}
