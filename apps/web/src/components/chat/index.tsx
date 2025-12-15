"use client"

import { useEffect, useState } from "react"
import { getSavedUser, clearUser } from "@/lib/storage"
import { socket } from "@/lib/socket"
import { Button } from "@/components/ui/button"
import LoginModal from "../login-modal"
import { ChatInput } from "./form"
import { ChatMessages } from "./messages"
import { toast } from "sonner"

export function Chat() {
    const [user, setUser] = useState<string | null>(null)
    const [messages, setMessages] = useState<any[]>([])

    useEffect(() => {
        const savedUser = getSavedUser()
        if (savedUser) {
            setUser(savedUser)
            socket.emit("login", savedUser)
        }
    }, [])

    useEffect(() => {
        socket.on("previousMessage", setMessages)
        return () => {
            socket.off("previousMessage")
        }
    }, [])

    useEffect(() => {
        socket.on("errorMessage", payload => {
            toast.error(payload.message)
        })
    }, [])

    function logout() {
        clearUser()
        location.reload()
    }

    return (
        <>
            <LoginModal open={!user} onLogin={setUser} />

            <div className="bg-background w-full max-w-xl rounded-xl border shadow">
                <div className="flex items-center justify-between border-b p-4">
                    <span className="font-semibold">{user}</span>
                    <Button variant="outline" onClick={logout}>
                        Sair
                    </Button>
                </div>

                <ChatMessages messages={messages} currentUser={user} />
                <ChatInput />
            </div>
        </>
    )
}
