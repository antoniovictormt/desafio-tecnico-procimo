import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import { LoginModal } from "../index"

describe("LoginModal", () => {
    it("should render the modal when open is true", () => {
        render(<LoginModal open={true} onLogin={jest.fn()} />)

        expect(screen.getByText("Entrar no chat")).toBeInTheDocument()
    })

    it("should call onLogin with the user name when form is submitted", () => {
        const onLoginMock = jest.fn()
        render(<LoginModal open={true} onLogin={onLoginMock} />)

        const input = screen.getByPlaceholderText("Seu nome")
        fireEvent.change(input, { target: { value: "Test User" } })

        const form = screen.getByRole("form")
        fireEvent.submit(form)

        expect(onLoginMock).toHaveBeenCalledWith("Test User")
    })
})
