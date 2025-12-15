"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { socket } from "@/lib/socket"
import { useRef, useEffect } from "react"

export function ChatForm() {
    function handleSubmit(formData: FormData) {
        const content = formData.get("content")?.toString()
        socket.emit("message", { content })
    }

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    return (
        <form action={handleSubmit} className="flex gap-2 px-2 py-1">
            <Input name="content" placeholder="Digite sua mensagem" autoFocus />
            <Button>Enviar</Button>
        </form>
    )
}
