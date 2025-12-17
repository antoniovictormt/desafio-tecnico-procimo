import { saveUser, getSavedUser, clearUser } from ".."

describe("storage", () => {
    beforeEach(() => {
        localStorage.clear()
        jest.clearAllMocks()
    })

    describe("saveUser", () => {
        it("saves user to localStorage with default expiration", () => {
            const user = "testuser"
            saveUser(user)

            const stored = localStorage.getItem("chat:user")
            expect(stored).toBeTruthy()

            const parsed = JSON.parse(stored!)
            expect(parsed.user).toBe(user)
            expect(parsed.expiresAt).toBeGreaterThan(Date.now())
        })

        it("saves user to localStorage with custom expiration", () => {
            const user = "testuser"
            const days = 7
            const now = Date.now()
            saveUser(user, days)

            const stored = localStorage.getItem("chat:user")
            expect(stored).toBeTruthy()

            const parsed = JSON.parse(stored!)
            expect(parsed.user).toBe(user)
            expect(parsed.expiresAt).toBeGreaterThanOrEqual(
                now + days * 86400000 - 10
            )
            expect(parsed.expiresAt).toBeLessThanOrEqual(
                now + days * 86400000 + 10
            )
        })
    })

    describe("getSavedUser", () => {
        it("returns null when no user is saved", () => {
            const result = getSavedUser()
            expect(result).toBeNull()
        })

        it("returns user when valid data exists", () => {
            const user = "testuser"
            const expiresAt = Date.now() + 86400000
            localStorage.setItem(
                "chat:user",
                JSON.stringify({ user, expiresAt })
            )

            const result = getSavedUser()
            expect(result).toBe(user)
        })

        it("returns null when data is expired", () => {
            const user = "testuser"
            const expiresAt = Date.now() - 1000
            localStorage.setItem(
                "chat:user",
                JSON.stringify({ user, expiresAt })
            )

            const result = getSavedUser()
            expect(result).toBeNull()
            expect(localStorage.getItem("chat:user")).toBeNull()
        })

        it("returns null when data is malformed", () => {
            localStorage.setItem("chat:user", "invalid json")

            const result = getSavedUser()
            expect(result).toBeNull()
        })
    })

    describe("clearUser", () => {
        it("removes user from localStorage", () => {
            localStorage.setItem(
                "chat:user",
                JSON.stringify({ user: "test", expiresAt: Date.now() + 1000 })
            )

            clearUser()

            expect(localStorage.getItem("chat:user")).toBeNull()
        })
    })
})
