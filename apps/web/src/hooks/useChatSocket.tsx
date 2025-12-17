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

export type ConnectionStatus = "connected" | "disconnected" | "reconnecting"

interface UseChatSocketReturn {
    messages: IMessage[]
    connectionStatus: ConnectionStatus
    errorMessage: string | null
    clearError: () => void
    logout: () => void
}

export function useChatSocket(): UseChatSocketReturn {
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

        function onError(error: { message: string }) {
            setErrorMessage(error.message)
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
        setMessages([])
    }

    return {
        messages,
        connectionStatus,
        errorMessage,
        clearError: () => setErrorMessage(null),
        logout
    }
}
