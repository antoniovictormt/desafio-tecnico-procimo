"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "../login-modal"
import { ChatForm } from "./form"
import { ChatMessages } from "./messages"
import { useChat, ConnectionStatus } from "@/hooks/useChat"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export const getStatusText = (status: ConnectionStatus) => {
    switch (status) {
        case "connected":
            return "Conectado"
        case "disconnected":
            return "Desconectado"
        case "reconnecting":
            return "Reconectando..."
        default:
            return "Desconhecido"
    }
}

export const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
        case "connected":
            return "text-green-600"
        case "disconnected":
            return "text-red-600"
        case "reconnecting":
            return "text-yellow-600"
        default:
            return "text-gray-600"
    }
}

export function Chat({ initialUser }: { initialUser: string | null }) {
    const {
        messages,
        setUser,
        user,
        logout,
        connectionStatus,
        errorMessage,
        clearError
    } = useChat({
        initialUser
    })

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
            clearError()
        }
    }, [errorMessage, clearError])

    return (
        <>
            <LoginModal open={!user} onLogin={setUser} />

            <div className="bg-background flex h-11/12 w-11/12 flex-col rounded-lg">
                <header className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex flex-col">
                        <span className="font-semibold">{user}</span>
                        {user && (
                            <span
                                className={`text-sm ${getStatusColor(connectionStatus)}`}
                            >
                                {getStatusText(connectionStatus)}
                            </span>
                        )}
                    </div>
                    {user && (
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut />
                        </Button>
                    )}
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
