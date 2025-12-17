const KEY = "chat:user"

export function saveUser(user: string, days = 3) {
    const expiresAt = Date.now() + days * 86400000
    localStorage.setItem(KEY, JSON.stringify({ user, expiresAt }))
}

export function getSavedUser() {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null

    try {
        const data = JSON.parse(raw)
        if (Date.now() > data.expiresAt) {
            localStorage.removeItem(KEY)
            return null
        }

        return data.user
    } catch {
        localStorage.removeItem(KEY)
        return null
    }
}

export function clearUser() {
    localStorage.removeItem(KEY)
}
