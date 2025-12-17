import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChatForm } from ".."
import { socket } from "@/lib/socket"
import { toast } from "sonner"

jest.mock("@/lib/socket", () => ({
    socket: { emit: jest.fn() }
}))

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn()
    }
}))

describe("ChatForm", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("emits message with form content on submit", async () => {
        const user = userEvent.setup()

        render(<ChatForm />)

        const input = screen.getByLabelText("message-input")
        const button = screen.getByRole("button", { name: /enviar/i })

        await user.type(input, "Hello")
        await user.click(button)

        expect(socket.emit).toHaveBeenCalledWith("message", {
            content: "Hello"
        })
    })

    it("shows error toast for empty message", async () => {
        const user = userEvent.setup()

        render(<ChatForm />)

        const button = screen.getByRole("button", { name: /enviar/i })

        await user.click(button)

        expect(toast.error).toHaveBeenCalledWith(
            "A mensagem não pode estar vazia."
        )
        expect(socket.emit).not.toHaveBeenCalled()
    })

    it("shows error toast for whitespace-only message", async () => {
        const user = userEvent.setup()

        render(<ChatForm />)

        const input = screen.getByLabelText("message-input")
        const button = screen.getByRole("button", { name: /enviar/i })

        await user.type(input, "   ")
        await user.click(button)

        expect(toast.error).toHaveBeenCalledWith(
            "A mensagem não pode estar vazia."
        )
        expect(socket.emit).not.toHaveBeenCalled()
    })

    it("shows error toast for message too long", async () => {
        const user = userEvent.setup()

        render(<ChatForm />)

        const input = screen.getByLabelText("message-input")
        const button = screen.getByRole("button", { name: /enviar/i })

        const longMessage = "a".repeat(501)

        // Set the input value directly to avoid slow typing
        input.setAttribute("value", longMessage)

        await user.click(button)

        expect(toast.error).toHaveBeenCalledWith(
            "A mensagem deve ter no máximo 500 caracteres."
        )
        expect(socket.emit).not.toHaveBeenCalled()
    })

    it("clears input after successful submit", async () => {
        const user = userEvent.setup()

        render(<ChatForm />)

        const input = screen.getByLabelText("message-input")
        const button = screen.getByRole("button", { name: /enviar/i })

        await user.type(input, "Hello")
        await user.click(button)

        expect((input as HTMLInputElement).value).toBe("")
    })

    it("handles missing form data gracefully", async () => {
        const user = userEvent.setup()

        render(<ChatForm />)

        const input = screen.getByLabelText("message-input")
        const button = screen.getByRole("button", { name: /enviar/i })

        // Remove name attribute to simulate missing form data
        input.removeAttribute("name")

        await user.click(button)

        expect(toast.error).toHaveBeenCalledWith(
            "A mensagem não pode estar vazia."
        )
        expect(socket.emit).not.toHaveBeenCalled()
    })
})
