import { formatTimestamp } from "../index"

describe("formatTimestamp", () => {
    it("should format a valid timestamp", () => {
        const result = formatTimestamp("2025-12-17T10:00:00Z")
        expect(result).toBe("07:00")
    })

    it("should return an empty string for an invalid timestamp", () => {
        const result = formatTimestamp("invalid-date")
        expect(result).toBe("")
    })
})
