"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { socket } from "@/lib/socket"
import { toast } from "sonner"

export function ChatForm() {
    function handleSubmit(formData: FormData) {
        const content = formData.get("content")?.toString()?.trim()

        if (!content) {
            toast.error("Message cannot be empty.")
            return
        }

        if (content.length > 500) {
            toast.error("Message must be at most 500 characters long.")
            return
        }

        socket.emit("message", { content })

        const input = document.querySelector(
            'input[name="content"]'
        ) as HTMLInputElement

        if (input) input.value = ""
    }

    return (
        <form action={handleSubmit} className="flex gap-2 px-2 py-1">
            <Input
                name="content"
                placeholder="Type your message"
                autoFocus
                aria-label="message-input"
            />
            <Button>Send</Button>
        </form>
    )
}
