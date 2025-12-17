import { io as Client, Socket } from "socket.io-client"
import { createServer } from "../app"
import type { Server as HttpServer } from "http"

describe("Chat Socket.IO", () => {
    let socket: Socket
    let server: HttpServer
    let port: number

    beforeAll(done => {
        const { httpServer } = createServer()

        function getServerPort(server: HttpServer): number {
            const address = server.address()

            if (!address || typeof address === "string") {
                throw new Error("Server address is not available")
            }

            return address.port
        }

        server = httpServer.listen(() => {
            port = getServerPort(server)
            done()
        })
    })

    afterAll(() => {
        server.close()
    })

    beforeEach(() => {
        socket = Client(`http://localhost:${port}`, {
            transports: ["websocket"],
            forceNew: true
        })
    })

    afterEach(() => {
        socket.disconnect()
    })

    it("should send previous messages after login", done => {
        socket.on("connect", () => {
            socket.emit("login", { id: "1", name: "Antonio" })
        })

        socket.on("previousMessage", messages => {
            expect(Array.isArray(messages)).toBe(true)
            done()
        })
    })

    it("should not allow empty message", done => {
        socket.on("connect", () => {
            socket.emit("login", { id: "1", name: "Antonio" })
            socket.emit("message", { content: "   " })
        })

        socket.on("errorMessage", error => {
            expect(error).toEqual({
                type: "validation",
                field: "content",
                message: "Message cannot be empty."
            })
            done()
        })
    })

    it("should not allow messages longer than 500 characters", done => {
        const longMessage = "a".repeat(501)

        socket.on("connect", () => {
            socket.emit("login", { id: "1", name: "Antonio" })
            socket.emit("message", { content: longMessage })
        })

        socket.on("errorMessage", error => {
            expect(error).toEqual({
                type: "validation",
                field: "content",
                message: "Message must be at most 500 characters long."
            })
            done()
        })
    })

    it("should not process message if user is not logged in", done => {
        let eventEmitted = false

        socket.on("connect", () => {
            socket.emit("message", { content: "Hello without login" })
        })

        socket.on("previousMessage", () => {
            eventEmitted = true
        })

        socket.on("errorMessage", () => {
            eventEmitted = true
        })

        setTimeout(() => {
            expect(eventEmitted).toBe(false)
            done()
        }, 100)
    })

    it("should broadcast a valid message to the chat", done => {
        let callCount = 0

        socket.on("connect", () => {
            socket.emit("login", { id: "1", name: "Antonio" })
            socket.emit("message", { content: "Message #10 from Alice" })
        })

        socket.on("previousMessage", messages => {
            callCount++

            if (callCount === 1) return

            const lastMessage = messages[messages.length - 1]

            expect(lastMessage.content).toBe("Message #10 from Alice")
            expect(lastMessage.user.name).toBe("Antonio")
            expect(lastMessage.id).toBeDefined()

            done()
        })
    })
})
