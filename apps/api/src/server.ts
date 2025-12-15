import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"
import path from "path"
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

let messages = initialMessages

io.on("connection", socket => {
    console.log("Client connected:", socket.id)

    console.log(messages)

    socket.emit("previousMessage", messages)

    socket.on("message", message => {
        const normalizedMessage = {
            id: crypto.randomUUID(),
            user: message.user,
            content: message.content,
            timestamp: Date.now()
        }

        messages.push(normalizedMessage)
        socket.broadcast.emit("receivedMessage", normalizedMessage)
    })
})

httpServer.listen(3333, () => {
    console.log("🚀 Server running on http://localhost:3333")
})
