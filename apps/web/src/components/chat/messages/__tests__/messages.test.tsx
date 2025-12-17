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

    it("renders the messages container", () => {
        render(<ChatMessages messages={messages} currentUser="Antonio" />)

        expect(screen.getByTestId("chat-messages")).toBeInTheDocument()
    })

    it("renders my message correctly", () => {
        render(<ChatMessages messages={messages} currentUser="Antonio" />)

        expect(screen.getByTestId("my-message")).toHaveTextContent("Olá")
    })

    it("renders other user message with username", () => {
        render(<ChatMessages messages={messages} currentUser="Antonio" />)

        expect(screen.getByTestId("message-user")).toHaveTextContent("Maria")
    })

    it("scrolls to bottom when messages change", () => {
        const scrollIntoViewMock = HTMLElement.prototype
            .scrollIntoView as jest.MockedFunction<any>
        scrollIntoViewMock.mockClear()

        const { rerender } = render(
            <ChatMessages messages={[]} currentUser="Antonio" />
        )

        expect(scrollIntoViewMock).toHaveBeenCalledWith({
            behavior: "smooth"
        })

        scrollIntoViewMock.mockClear()

        rerender(<ChatMessages messages={messages} currentUser="Antonio" />)

        expect(scrollIntoViewMock).toHaveBeenCalledWith({
            behavior: "smooth"
        })
    })
})
