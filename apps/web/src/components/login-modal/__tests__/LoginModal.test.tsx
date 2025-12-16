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

        fireEvent.change(screen.getByPlaceholderText("Seu nome"), {
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

        fireEvent.change(screen.getByPlaceholderText("Seu nome"), {
            target: { value: "   " } // só espaços
        })

        fireEvent.click(screen.getByTestId("button-login"))

        expect(onLogin).not.toHaveBeenCalled()
        expect(saveUser).not.toHaveBeenCalled()
        expect(socket.emit).not.toHaveBeenCalled()
    })
})
