import { ChatConnectionStatus } from "@/types"

export const getStatusText = (status: ChatConnectionStatus) => {
    switch (status) {
        case "connected":
            return "Conectado"
        case "disconnected":
            return "Desconectado"
        case "reconnecting":
            return "Reconectando..."
        default:
            return "Desconhecido"
    }
}
