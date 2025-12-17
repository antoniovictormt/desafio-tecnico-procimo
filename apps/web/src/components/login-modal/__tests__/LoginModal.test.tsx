import { render, screen, fireEvent } from "@testing-library/react"
import { LoginModal } from ".."
import { socket } from "@/lib/socket"
import { saveUser } from "@/lib/storage"

jest.mock("@/lib/socket", () => ({
    socket: {
        emit: jest.fn()
    }
}))

jest.mock("@/lib/storage", () => ({
    saveUser: jest.fn()
}))

describe("LoginModal", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("calls onLogin with username", () => {
        const onLogin = jest.fn()

        render(<LoginModal open onLogin={onLogin} />)

        fireEvent.change(screen.getByPlaceholderText("Your name"), {
            target: { value: "Antonio" }
        })

        fireEvent.click(screen.getByTestId("button-login"))

        expect(onLogin).toHaveBeenCalledWith("Antonio")
        expect(saveUser).toHaveBeenCalledWith("Antonio")
        expect(socket.emit).toHaveBeenCalledWith("login", "Antonio")
    })

    it("does not submit when username is empty", () => {
        const onLogin = jest.fn()

        render(<LoginModal open onLogin={onLogin} />)

        fireEvent.change(screen.getByPlaceholderText("Your name"), {
            target: { value: "   " }
        })

        fireEvent.click(screen.getByTestId("button-login"))

        expect(onLogin).not.toHaveBeenCalled()
        expect(saveUser).not.toHaveBeenCalled()
        expect(socket.emit).not.toHaveBeenCalled()
    })

    it("does not submit when form data is missing user field", () => {
        const onLogin = jest.fn()

        render(<LoginModal open onLogin={onLogin} />)

        const input = screen.getByPlaceholderText("Your name")
        input.removeAttribute("name")

        fireEvent.click(screen.getByTestId("button-login"))

        expect(onLogin).not.toHaveBeenCalled()
        expect(saveUser).not.toHaveBeenCalled()
        expect(socket.emit).not.toHaveBeenCalled()
    })
})
