"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { ChatMessagesProps } from "@/types"
import { formatTimestamp } from "@/lib/formatTime"
import { getUserColor } from "@/lib/getUserColor"

export function ChatMessages({ messages, currentUser }: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div
            className="h-full space-y-4 overflow-y-auto p-4"
            data-testid="chat-messages"
        >
            {messages.map(msg => {
                const isMine = msg.user === currentUser
                const userColor = getUserColor(msg.user)

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
                                "max-w-[75%] rounded-lg px-4 py-2",
                                isMine
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted/40"
                            )}
                        >
                            {!isMine && (
                                <div className="mb-1 flex items-center gap-2 text-xs">
                                    <span
                                        data-testid="message-user"
                                        className={cn("font-medium", userColor)}
                                    >
                                        ~ {msg.user}
                                    </span>

                                    <span
                                        data-testid="message-timestamp"
                                        className="text-muted-foreground"
                                    >
                                        {formatTimestamp(msg.timestamp)}
                                    </span>
                                </div>
                            )}

                            <p
                                data-testid="message-content"
                                className="text-sm leading-relaxed whitespace-pre-wrap"
                            >
                                {msg.content}
                            </p>
                        </div>
                    </div>
                )
            })}

            <div ref={bottomRef} />
        </div>
    )
}
