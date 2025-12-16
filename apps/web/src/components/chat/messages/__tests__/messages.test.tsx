import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { ChatMessages } from ".."

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    writable: true,
    value: jest.fn()
})

const messages = [
    {
        id: "1",
        user: "Antonio",
        content: "Olá",
        timestamp: Date.now()
    },
    {
        id: "2",
        user: "Maria",
        content: "Oi",
        timestamp: Date.now()
    }
]

describe("ChatMessages", () => {
    beforeAll(() => {
        HTMLElement.prototype.scrollIntoView = jest.fn()
    })

    it("renders all messages", () => {
        render(<ChatMessages messages={messages} currentUser="Antonio" />)

        expect(screen.getAllByTestId("chat-message")).toHaveLength(2)
    })

    it("renders my message correctly", () => {
        render(<ChatMessages messages={messages} currentUser="Antonio" />)

        expect(screen.getByTestId("my-message")).toHaveTextContent("Olá")
    })

    it("renders other user message with username", () => {
        render(<ChatMessages messages={messages} currentUser="Antonio" />)

        expect(screen.getByTestId("message-user")).toHaveTextContent("Maria")
    })
})
