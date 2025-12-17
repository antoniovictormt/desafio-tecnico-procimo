"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import { clearUser } from "@/lib/storage"
import { IMessage } from "@desafio-tecnico-procimo/types"
import { ChatConnectionStatus, ChatSocketState } from "@/types"

export function useChatSocket(): ChatSocketState {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [connectionStatus, setConnectionStatus] =
        useState<ChatConnectionStatus>("disconnected")
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
        socketConnectionStatus: connectionStatus,
        socketErrorMessage: errorMessage,
        clearError: () => setErrorMessage(null),
        logout
    }
}
