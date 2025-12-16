"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { socket } from "@/lib/socket"

export function ChatForm() {
    function handleSubmit(formData: FormData) {
        const content = formData.get("content")?.toString()
        socket.emit("message", { content })
    }

    return (
        <form action={handleSubmit} className="flex gap-2 px-2 py-1">
            <Input
                name="content"
                placeholder="Digite sua mensagem"
                autoFocus
                aria-label="message-input"
            />
            <Button>Enviar</Button>
        </form>
    )
}
