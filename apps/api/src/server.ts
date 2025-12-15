import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import path from "path"
import crypto from "crypto"
import { initialMessages } from "./seed/message"

const app = express()
app.use(cors())

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
})

app.use(express.static(path.resolve(__dirname, "..", "public")))

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
                message: "A mensagem não pode estar vazia."
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

httpServer.listen(3333, () => {
    console.log("🚀 Server running on http://localhost:3333")
})
