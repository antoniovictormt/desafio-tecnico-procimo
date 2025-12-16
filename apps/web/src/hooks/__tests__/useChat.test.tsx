import { renderHook, act } from "@testing-library/react"
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

    it("shows toast error when socket emits errorMessage", () => {
        renderHook(() => useChat({ initialUser: null }))

        const mockedSocket = socket as unknown as {
            __emit: (event: string, payload: any) => void
        }

        act(() => {
            mockedSocket.__emit("errorMessage", {
                message: "A mensagem não pode estar vazia."
            })
        })

        expect(toast.error).toHaveBeenCalledWith(
            "A mensagem não pode estar vazia."
        )
    })

    it("logs in with saved user from storage", () => {
        ;(getSavedUser as jest.Mock).mockReturnValue("Antonio")

        const { result } = renderHook(() => useChat({ initialUser: null }))

        expect(result.current.user).toBe("Antonio")
        expect(socket.emit).toHaveBeenCalledWith("login", "Antonio")
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
                content: "Olá",
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

        expect(socket.emit).toHaveBeenCalledWith("logout")
        expect(clearUser).toHaveBeenCalled()
        expect(result.current.user).toBeNull()
        expect(result.current.messages).toEqual([])
    })
})
