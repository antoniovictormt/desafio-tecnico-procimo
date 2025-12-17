import { render } from "@testing-library/react"
import "@testing-library/jest-dom"
import { Chat } from ".."
import { toast } from "sonner"
import { getStatusColor } from "@/lib/getStatusColor"
import { getStatusText } from "@/lib/getStatusText"

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn()
    }
}))

jest.mock("@/hooks/useChat", () => ({
    useChat: jest.fn()
}))

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    writable: true,
    value: jest.fn()
})

const mockUseChat = require("@/hooks/useChat").useChat

describe("Chat", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("shows toast error when errorMessage is set", () => {
        mockUseChat.mockReturnValue({
            user: "TestUser",
            messages: [],
            connectionStatus: "connected",
            errorMessage: "Test error",
            clearError: jest.fn()
        })

        render(<Chat initialUser="TestUser" />)

        expect(toast.error).toHaveBeenCalledWith("Test error")
    })

    it("does not show toast when errorMessage is null", () => {
        mockUseChat.mockReturnValue({
            user: "TestUser",
            messages: [],
            connectionStatus: "connected",
            errorMessage: null,
            clearError: jest.fn()
        })

        render(<Chat initialUser="TestUser" />)

        expect(toast.error).not.toHaveBeenCalled()
    })

    it("renders status text for unknown connection status", () => {
        mockUseChat.mockReturnValue({
            user: "TestUser",
            messages: [],
            connectionStatus: "unknown" as any,
            errorMessage: null,
            clearError: jest.fn()
        })

        const { getByText } = render(<Chat initialUser="TestUser" />)

        expect(getByText("Unknown")).toBeInTheDocument()
    })

    it("renders status color for unknown connection status", () => {
        mockUseChat.mockReturnValue({
            user: "TestUser",
            messages: [],
            connectionStatus: "unknown" as any,
            errorMessage: null,
            clearError: jest.fn()
        })

        const { container } = render(<Chat initialUser="TestUser" />)

        expect(
            container.querySelector('[class*="text-gray-600"]')
        ).toBeInTheDocument()
    })

    it("getStatusText returns correct text for all statuses", () => {
        expect(getStatusText("connected")).toBe("Connected")
        expect(getStatusText("disconnected")).toBe("Disconnected")
        expect(getStatusText("reconnecting")).toBe("Reconnecting...")
        expect(getStatusText("unknown" as any)).toBe("Unknown")
    })

    it("getStatusColor returns correct color for all statuses", () => {
        expect(getStatusColor("connected")).toBe("text-green-600")
        expect(getStatusColor("disconnected")).toBe("text-red-600")
        expect(getStatusColor("reconnecting")).toBe("text-yellow-600")
        expect(getStatusColor("unknown" as any)).toBe("text-gray-600")
    })

    it("does not show connection status when user is not logged in", () => {
        mockUseChat.mockReturnValue({
            user: null,
            messages: [],
            connectionStatus: "connected",
            errorMessage: null,
            clearError: jest.fn()
        })

        const { container } = render(<Chat initialUser={null} />)

        expect(
            container.querySelector('[class*="text-green-600"]')
        ).not.toBeInTheDocument()
        expect(
            container.querySelector('[class*="text-red-600"]')
        ).not.toBeInTheDocument()
        expect(
            container.querySelector('[class*="text-yellow-600"]')
        ).not.toBeInTheDocument()
        expect(
            container.querySelector('[class*="text-gray-600"]')
        ).not.toBeInTheDocument()
    })

    it("does not show logout button when user is not logged in", () => {
        mockUseChat.mockReturnValue({
            user: null,
            messages: [],
            connectionStatus: "connected",
            errorMessage: null,
            clearError: jest.fn()
        })

        const { queryByTestId } = render(<Chat initialUser={null} />)

        expect(queryByTestId("logout-button")).not.toBeInTheDocument()
    })
})
