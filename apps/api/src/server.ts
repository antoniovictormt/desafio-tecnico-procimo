import "dotenv/config"
import { createServer } from "./app"

const PORT = Number(process.env.PORT) || 3332

const { httpServer } = createServer()

httpServer.listen(PORT, () => {
    console.log("🚀 Server running on port:", PORT)
})
