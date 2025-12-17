import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import crypto from "crypto"
import { initialMessages } from "./seed/message"

export function createServer() {
    const app = express()
    app.use(cors())

    const httpServer = http.createServer(app)

    const io = new Server(httpServer, {
        cors: { origin: "*" }
    })

    let messages = initialMessages.slice(-10)

    io.on("connection", socket => {
        socket.on("login", user => {
            socket.data.user = user
            socket.join("chat")
            socket.emit("previousMessage", messages)
        })

        socket.on("message", message => {
            if (!socket.data.user) return

            const content = message?.content?.trim()

            if (!content) {
                socket.emit("errorMessage", {
                    type: "validation",
                    field: "content",
                    message: "A mensagem não pode estar vazia."
                })
                return
            }

            if (content.length > 500) {
                socket.emit("errorMessage", {
                    type: "validation",
                    field: "content",
                    message: "A mensagem deve ter no máximo 500 caracteres."
                })
                return
            }

            const normalizedMessage = {
                id: crypto.randomUUID(),
                user: socket.data.user,
                content,
                timestamp: Date.now()
            }

            messages.push(normalizedMessage)
            messages = messages.slice(-10)

            io.to("chat").emit("previousMessage", messages)
        })

        socket.on("disconnect", () => {
            socket.leave("chat")
        })
    })

    return { httpServer }
}
