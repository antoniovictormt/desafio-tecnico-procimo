export function formatTimestamp(date: number | string | Date) {
    const parsed = new Date(date)

    if (isNaN(parsed.getTime())) return ""

    return parsed.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })
}
