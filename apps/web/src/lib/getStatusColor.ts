import { ChatConnectionStatus } from "@/types"

export const getStatusColor = (status: ChatConnectionStatus) => {
    switch (status) {
        case "connected":
            return "text-green-600"
        case "disconnected":
            return "text-red-600"
        case "reconnecting":
            return "text-yellow-600"
        default:
            return "text-gray-600"
    }
}
