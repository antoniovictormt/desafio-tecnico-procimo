import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ChatForm } from ".."
import { socket } from "@/lib/socket"

jest.mock("@/lib/socket", () => ({
    socket: { emit: jest.fn() }
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
})
