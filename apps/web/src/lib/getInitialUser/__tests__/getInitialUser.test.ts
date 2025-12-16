import { cookies } from "next/headers"
import { getInitialUser } from ".."

jest.mock("next/headers", () => ({
    cookies: jest.fn()
}))

describe("getInitialUser", () => {
    it("returns user from cookie when it exists", async () => {
        ;(cookies as jest.Mock).mockResolvedValue({
            get: (key: string) =>
                key === "chat:user" ? { value: "Antonio" } : undefined
        })

        const user = await getInitialUser()

        expect(user).toBe("Antonio")
    })

    it("returns null when cookie does not exist", async () => {
        ;(cookies as jest.Mock).mockResolvedValue({
            get: () => undefined
        })

        const user = await getInitialUser()

        expect(user).toBeNull()
    })
})
