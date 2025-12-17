"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "../login-modal"
import { ChatForm } from "./form"
import { ChatMessages } from "./messages"
import { useChat } from "@/hooks/useChat"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { ModeToggle } from "../mode-toggle"
import { getStatusColor } from "@/lib/getStatusColor"
import { getStatusText } from "@/lib/getStatusText"

export function Chat({ initialUser }: { initialUser: string | null }) {
    const {
        messages,
        setUser,
        user,
        logout,
        connectionStatus,
        errorMessage,
        clearError
    } = useChat({ initialUser })

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
                                data-testid="connection-status"
                                className={`text-sm ${getStatusColor(
                                    connectionStatus
                                )}`}
                            >
                                {getStatusText(connectionStatus)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <ModeToggle />

                        {user && (
                            <Button
                                data-testid="logout-button"
                                variant="outline"
                                size="icon"
                                className="text-red-500"
                                onClick={logout}
                            >
                                <LogOut />
                            </Button>
                        )}
                    </div>
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
