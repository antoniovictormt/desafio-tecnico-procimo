"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveUser } from "@/lib/storage"
import { socket } from "@/lib/socket"

export default function LoginModal({
    open,
    onLogin
}: {
    open: boolean
    onLogin: (user: string) => void
}) {
    function handleSubmit(formData: FormData) {
        const user = formData.get("user")?.toString().trim()
        if (!user) return

        saveUser(user)
        socket.emit("login", user)
        onLogin(user)
    }

    return (
        <Dialog open={open}>
            <DialogContent
                className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 sm:max-w-sm"
                onInteractOutside={e => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Entrar no chat</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4">
                    <Input name="user" placeholder="Seu nome" autoFocus />
                    <Button className="w-full">Entrar</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
