"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    user: string
    content: string
}

export function ChatMessages({
    messages,
    currentUser
}: {
    messages: Message[]
    currentUser: string | null
}) {
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="h-100 space-y-3 overflow-y-auto p-4">
            {messages.map(message => {
                const isMine = message.user === currentUser

                return (
                    <div
                        key={message.id}
                        className={cn(
                            "flex",
                            isMine ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                                isMine
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            )}
                        >
                            {!isMine && (
                                <div className="mb-1 text-xs font-semibold">
                                    {message.user}
                                </div>
                            )}
                            {message.content}
                        </div>
                    </div>
                )
            })}

            <div ref={bottomRef} />
        </div>
    )
}
