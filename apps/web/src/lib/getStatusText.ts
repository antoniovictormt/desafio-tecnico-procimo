import { ChatConnectionStatus } from "@/types"

export const getStatusText = (status: ChatConnectionStatus) => {
    switch (status) {
        case "connected":
            return "Connected"
        case "disconnected":
            return "Disconnected"
        case "reconnecting":
            return "Reconnecting..."
        default:
            return "Unknown"
    }
}
