"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { IMessage } from "@/hooks/useChat"

export function ChatMessages({
    messages,
    currentUser
}: {
    messages: IMessage[]
    currentUser: string | null
}) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="h-full space-y-3 overflow-y-auto p-4">
            {messages.map(msg => {
                const isMine = msg.user === currentUser

                return (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex",
                            isMine ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-3/4 rounded-lg px-3 py-2 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap",
                                isMine
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            )}
                        >
                            {!isMine && (
                                <div className="mb-1 text-xs font-semibold">
                                    {msg.user}
                                </div>
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
