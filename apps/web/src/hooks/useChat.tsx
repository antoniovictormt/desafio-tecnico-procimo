"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import { getSavedUser, clearUser } from "@/lib/storage"
import { useChatSocket } from "./useChatSocket"

export function useChat({ initialUser }: { initialUser: string | null }) {
    const [user, setUser] = useState<string | null>(initialUser)
    const {
        messages,
        socketConnectionStatus: connectionStatus,
        socketErrorMessage: errorMessage,
        clearError,
        logout: socketLogout
    } = useChatSocket()

    useEffect(() => {
        const savedUser = getSavedUser()

        if (savedUser) {
            setUser(savedUser)
            socket.emit("login", savedUser)
        }
    }, [])

    function logout() {
        clearUser()
        setUser(null)
        socketLogout()
    }

    return {
        user,
        setUser,
        messages,
        logout,
        connectionStatus,
        errorMessage,
        clearError
    }
}
