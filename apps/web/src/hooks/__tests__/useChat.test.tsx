import { renderHook, act, waitFor } from "@testing-library/react"
import { useChat } from "../useChat"
import { toast } from "sonner"
import { socket } from "@/lib/socket"
import { clearUser, getSavedUser } from "@/lib/storage"

jest.mock("@/lib/socket", () => {
    const listeners: Record<string, Function> = {}

    return {
        socket: {
            on: jest.fn((event, cb) => {
                listeners[event] = cb
            }),
            off: jest.fn(),
            emit: jest.fn(),
            __emit(event: string, payload: any) {
                listeners[event]?.(payload)
            }
        }
    }
})

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn()
    }
}))

jest.mock("@/lib/storage", () => ({
    getSavedUser: jest.fn(),
    clearUser: jest.fn()
}))

describe("useChat – error handling", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("sets error message when socket emits errorMessage", () => {
        const { result } = renderHook(() => useChat({ initialUser: null }))

        const mockedSocket = socket as unknown as {
            __emit: (event: string, payload: any) => void
        }

        act(() => {
            mockedSocket.__emit("errorMessage", {
                message: "Message cannot be empty."
            })
        })

        expect(result.current.errorMessage).toBe("Message cannot be empty.")
    })

    it("clears error message when clearError is called", () => {
        const { result } = renderHook(() => useChat({ initialUser: null }))

        const mockedSocket = socket as unknown as {
            __emit: (event: string, payload: any) => void
        }

        act(() => {
            mockedSocket.__emit("errorMessage", {
                message: "Test error"
            })
        })

        expect(result.current.errorMessage).toBe("Test error")

        act(() => {
            result.current.clearError()
        })

        expect(result.current.errorMessage).toBeNull()
    })

    it("initializes with null error message", () => {
        const { result } = renderHook(() => useChat({ initialUser: null }))

        expect(result.current.errorMessage).toBeNull()
    })

    it("initializes with disconnected connection status", () => {
        const { result } = renderHook(() => useChat({ initialUser: null }))

        expect(result.current.connectionStatus).toBe("disconnected")
    })

    it("updates connection status on socket events", () => {
        const { result } = renderHook(() => useChat({ initialUser: null }))

        const mockedSocket = socket as unknown as {
            __emit: (event: string, payload: any) => void
        }

        act(() => {
            mockedSocket.__emit("connect")
        })

        expect(result.current.connectionStatus).toBe("connected")

        act(() => {
            mockedSocket.__emit("disconnect")
        })

        expect(result.current.connectionStatus).toBe("disconnected")

        act(() => {
            mockedSocket.__emit("reconnect_attempt")
        })

        expect(result.current.connectionStatus).toBe("reconnecting")
    })

    it("sets initial connection status to connected when socket is already connected", () => {
        const originalConnected = socket.connected
        ;(socket as any).connected = true

        const { result } = renderHook(() => useChat({ initialUser: null }))

        expect(result.current.connectionStatus).toBe("connected")
        ;(socket as any).connected = originalConnected
    })

    it("logs in with saved user from storage", () => {
        ;(getSavedUser as jest.Mock).mockReturnValue("Antonio")

        const { result } = renderHook(() => useChat({ initialUser: "Antonio" }))

        expect(result.current.user).toBe("Antonio")
    })

    it("updates messages when socket emits previousMessage", () => {
        const { result } = renderHook(() => useChat({ initialUser: null }))

        const mockedSocket = socket as unknown as {
            __emit: (event: string, payload: any) => void
        }

        const messages = [
            {
                id: "1",
                user: "Antonio",
                content: "Hello",
                timestamp: Date.now()
            }
        ]

        act(() => {
            mockedSocket.__emit("previousMessage", messages)
        })

        expect(result.current.messages).toEqual(messages)
    })

    it("removes socket listeners on unmount", () => {
        const { unmount } = renderHook(() => useChat({ initialUser: null }))

        unmount()

        expect(socket.off).toHaveBeenCalledWith(
            "previousMessage",
            expect.any(Function)
        )

        expect(socket.off).toHaveBeenCalledWith(
            "errorMessage",
            expect.any(Function)
        )
    })

    it("emits logout and clears state when user exists", () => {
        ;(getSavedUser as jest.Mock).mockReturnValue("Antonio")

        const { result } = renderHook(() => useChat({ initialUser: null }))

        act(() => {
            result.current.logout()
        })

        expect(clearUser).toHaveBeenCalled()
        expect(result.current.user).toBeNull()
        expect(result.current.messages).toEqual([])
    })
})
