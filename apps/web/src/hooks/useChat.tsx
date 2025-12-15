"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import { getSavedUser, clearUser } from "@/lib/storage"
import { toast } from "sonner"

export interface IMessage {
    id: string
    user: string
    content: string
    timestamp: number
}

export function useChat({ initialUser }: { initialUser: string | null }) {
    const [user, setUser] = useState<string | null>(initialUser)
    const [messages, setMessages] = useState<IMessage[]>([])

    useEffect(() => {
        const savedUser = getSavedUser()
        if (savedUser) {
            setUser(savedUser)
            socket.emit("login", savedUser)
        }
    }, [])

    useEffect(() => {
        function onMessages(messages: IMessage[]) {
            setMessages(messages)
        }

        function onError(message: string) {
            toast.error(message)
        }

        socket.on("previousMessage", onMessages)
        socket.on("errorMessage", onError)

        return () => {
            socket.off("previousMessage", onMessages)
            socket.off("errorMessage", onError)
        }
    }, [])

    function logout() {
        if (user) {
            socket.emit("logout")
        }

        clearUser()
        setUser(null)
        setMessages([])
    }

    return {
        user,
        setUser,
        messages,
        logout
    }
}
