"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import { getSavedUser, clearUser } from "@/lib/storage"

export interface IMessage {
    id: string
    user: string
    content: string
    timestamp: number
}

interface SocketErrorPayload {
    type?: string
    field?: string
    message: string
}

export type ConnectionStatus = "connected" | "disconnected" | "reconnecting"

export function useChat({ initialUser }: { initialUser: string | null }) {
    const [user, setUser] = useState<string | null>(initialUser)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>("disconnected")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        function onConnect() {
            setConnectionStatus("connected")
        }

        function onDisconnect() {
            setConnectionStatus("disconnected")
        }

        function onReconnectAttempt() {
            setConnectionStatus("reconnecting")
        }

        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("reconnect_attempt", onReconnectAttempt)

        // Set initial status
        if (socket.connected) {
            setConnectionStatus("connected")
        }

        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
            socket.off("reconnect_attempt", onReconnectAttempt)
        }
    }, [])

    useEffect(() => {
        function onMessages(messages: IMessage[]) {
            setMessages(messages)
        }

        function onError(payload: SocketErrorPayload) {
            setErrorMessage(payload.message)
        }

        socket.on("previousMessage", onMessages)
        socket.on("errorMessage", onError)

        return () => {
            socket.off("previousMessage", onMessages)
            socket.off("errorMessage", onError)
        }
    }, [])

    function logout() {
        clearUser()
        setUser(null)
        setMessages([])
    }

    return {
        user,
        setUser,
        messages,
        logout,
        connectionStatus,
        errorMessage,
        clearError: () => setErrorMessage(null)
    }
}
