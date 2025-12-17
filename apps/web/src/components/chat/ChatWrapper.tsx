import { Chat } from "@/components/chat"
import { getInitialUser } from "@/lib/getInitialUser"

export default async function ChatWrapper() {
    const initialUser = await getInitialUser()

    return <Chat initialUser={initialUser} />
}
