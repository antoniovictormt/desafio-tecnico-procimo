const USER_COLORS = [
    "text-red-300",
    "text-red-400",
    "text-red-500",
    "text-blue-300",
    "text-blue-400",
    "text-blue-500",
    "text-green-300",
    "text-green-400",
    "text-green-500",
    "text-yellow-300",
    "text-yellow-400",
    "text-yellow-500",
    "text-purple-300",
    "text-purple-400",
    "text-purple-500",
    "text-pink-300",
    "text-pink-400",
    "text-pink-500",
    "text-indigo-300",
    "text-indigo-400",
    "text-indigo-500",
    "text-teal-300",
    "text-teal-400",
    "text-teal-500",
    "text-cyan-300",
    "text-cyan-400",
    "text-cyan-500",
    "text-emerald-300",
    "text-emerald-400",
    "text-emerald-500"
]

export function getUserColor(username: string) {
    let hash = 0

    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }

    return USER_COLORS[Math.abs(hash) % USER_COLORS.length]
}
