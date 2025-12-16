import { cookies } from "next/headers"

export async function getInitialUser() {
    const cookieStore = await cookies()
    const user = cookieStore.get("chat:user")?.value ?? null

    return user
}
