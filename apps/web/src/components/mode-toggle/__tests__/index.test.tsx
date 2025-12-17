import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import { ModeToggle } from "../index"

const setTheme = jest.fn()

jest.mock("next-themes", () => ({
    useTheme: () => ({
        setTheme
    })
}))

jest.mock("@radix-ui/react-dropdown-menu", () => {
    const originalModule = jest.requireActual("@radix-ui/react-dropdown-menu")
    return {
        __esModule: true,
        ...originalModule,
        Root: ({ children }: { children: React.ReactNode }) => (
            <div>{children}</div>
        ),
        Trigger: ({ children }: { children: React.ReactNode }) => (
            <button>{children}</button>
        ),
        Content: ({ children }: { children: React.ReactNode }) => (
            <div role="menu">{children}</div>
        ),
        Item: ({
            children,
            onClick
        }: {
            children: React.ReactNode
            onClick: () => void
        }) => (
            <div
                role="menuitem"
                onClick={() => {
                    onClick()
                }}
            >
                {children}
            </div>
        ),
        Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>
    }
})

describe("ModeToggle", () => {
    it("should render the toggle button", () => {
        render(<ModeToggle />)

        expect(
            screen.getByRole("button", { name: "Toggle theme" })
        ).toBeInTheDocument()
    })

    it("should toggle themes when clicked", async () => {
        render(<ModeToggle />)

        const toggleButton = screen.getByRole("button")
        fireEvent.click(toggleButton)

        const dropdownItem = await screen.findByRole("menuitem", {
            name: "Light"
        })

        fireEvent.click(dropdownItem)

        expect(setTheme).toHaveBeenCalledWith("light")
    })
})
