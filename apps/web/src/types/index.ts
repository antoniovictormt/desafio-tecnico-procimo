import { IMessage } from "@desafio-tecnico-procimo/types"

export interface ChatMessagesProps {
    messages: IMessage[]
    currentUser: string | null
}

export type ChatConnectionStatus = "connected" | "disconnected" | "reconnecting"

export interface ChatSocketState {
    messages: IMessage[]
    socketConnectionStatus: ChatConnectionStatus
    socketErrorMessage: string | null
    clearError: () => void
    logout: () => void
}
