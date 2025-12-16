"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { IMessage } from "@/hooks/useChat"

interface ChatMessagesProps {
    messages: IMessage[]
    currentUser: string | null
}

export function ChatMessages({ messages, currentUser }: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div
            className="h-full space-y-3 overflow-y-auto p-4"
            data-testid="chat-messages"
        >
            {messages.map(msg => {
                const isMine = msg.user === currentUser

                return (
                    <div
                        key={msg.id}
                        data-testid="chat-message"
                        className={cn(
                            "flex",
                            isMine ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            data-testid={
                                isMine ? "my-message" : "other-message"
                            }
                            className={cn(
                                "max-w-3/4 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                                isMine
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            )}
                        >
                            {!isMine && (
                                <span data-testid="message-user">
                                    {msg.user}
                                </span>
                            )}
                            {msg.content}
                        </div>
                    </div>
                )
            })}
            <div ref={bottomRef} />
        </div>
    )
}
