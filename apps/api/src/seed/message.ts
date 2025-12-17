import { IMessage } from "@desafio-tecnico-procimo/types"

const users = [
    "System",
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace"
]

export const initialMessages: IMessage[] = Array.from(
    { length: 10 },
    (_, index): IMessage => {
        const user = users[index % users.length]

        return {
            id: String(index + 1),
            user,
            content:
                user === "System"
                    ? `System message #${index + 1}`
                    : `Message #${index + 1} from ${user}`,
            timestamp: Date.now() - (100 - index) * 60_000
        }
    }
)
