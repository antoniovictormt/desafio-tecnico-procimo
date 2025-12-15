const socket = io("http://localhost:3333")

const loginForm = document.getElementById("login")
const chatForm = document.getElementById("chat")

const loginInput = document.getElementById("loginUser")
const loggedUserSpan = document.getElementById("loggedUser")
const logoutBtn = document.getElementById("logoutBtn")

const messagesDiv = document.querySelector(".messages")
const messageInput = document.getElementById("content")

const errorBox = document.createElement("div")

const USER_STORAGE_KEY = "chat:user"

let loggedUser = null

errorBox.className = "error-message"
document.body.appendChild(errorBox)

function saveUser(user, days = 3) {
    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ user, expiresAt }))
}

function getSavedUser() {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null

    try {
        const data = JSON.parse(raw)

        if (Date.now() > data.expiresAt) {
            localStorage.removeItem(USER_STORAGE_KEY)
            return null
        }

        return data.user
    } catch {
        localStorage.removeItem(USER_STORAGE_KEY)
        return null
    }
}

function logout() {
    localStorage.removeItem(USER_STORAGE_KEY)
    location.reload()
}

function showChat(user) {
    loggedUserSpan.innerText = `Usuário: ${user}`
    loginForm.classList.add("hidden")
    chatForm.classList.remove("hidden")

    socket.emit("login", user)
}

function renderMessage(message) {
    const div = document.createElement("div")
    div.classList.add("message")

    div.innerHTML = `<strong>${message.user}</strong>: ${message.content}`

    messagesDiv.appendChild(div)
    messagesDiv.scrollTop = messagesDiv.scrollHeight
}

function showError(message) {
    errorBox.innerText = message
    errorBox.style.display = "block"

    setTimeout(() => {
        errorBox.style.display = "none"
    }, 3000)
}

loggedUser = getSavedUser()
if (loggedUser) {
    showChat(loggedUser)
}

loginForm.addEventListener("submit", event => {
    event.preventDefault()

    const username = loginInput.value.trim()
    if (!username) return

    loggedUser = username
    saveUser(username, 3)
    showChat(username)
})

logoutBtn.addEventListener("click", logout)

socket.on("previousMessage", messages => {
    messagesDiv.innerHTML = ""
    messages.forEach(renderMessage)
})

socket.on("receivedMessage", message => {
    renderMessage(message)
})

chatForm.addEventListener("submit", event => {
    event.preventDefault()

    const content = messageInput.value

    socket.emit("message", { content })

    messageInput.value = ""
})

socket.on("errorMessage", payload => {
    showError(payload.message)
})
