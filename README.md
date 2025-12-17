# Desafio Técnico Procimo

## Project Setup

### Prerequisite

Ensure you have the following installed:

- Node.js (LTS version recommended)
- Docker (for containerized services)

### Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd desafio-tecnico-procimo
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

### Running the Project

#### Using Docker Compose

1. Start the service:
    ```bash
    docker-compose up
    ```
2. Access the web application at [http://localhost:3000](http://localhost:3000).
3. The API will be available at [http://localhost:3333](http://localhost:3333).

#### Running Locally

1. Start the API:
    ```bash
    cd apps/api
    npm run dev
    ```
2. Start the web application:
    ```bash
    cd apps/web
    npm run dev
    ```
3. Access the web application at [http://localhost:3000](http://localhost:3000).

### Testing

Run the test suite:

```bash
npm run test
```

## Technical Choices

### WebSocket Library

I chose **Socket.IO** as the WebSocket library for this project. Socket.IO provides a robust and feature-rich abstraction over WebSockets, making it easier to handle real-time communication. It supports automatic reconnection, broadcasting, and room-based communication, which are essential for building a scalable chat application. Additionally, its compatibility with various environments and fallback mechanisms ensures reliable communication even in less-than-ideal network conditions.

### State Synchronization

To synchronize the "last 10 messages" on the server, we implemented the following approach:

1. **Message Storage**: Messages are stored in an in-memory data structure on the server. This ensures fast access and avoids the overhead of database queries for frequently accessed data.
2. **Message Retrieval**: When a client connects, the server sends the last 10 messages to the client. This is achieved by slicing the in-memory message array to retrieve the most recent entries.
3. **Real-Time Updates**: As new messages are sent, they are broadcast to all connected clients and appended to the in-memory store. If the store exceeds 10 messages, the oldest message is removed to maintain the limit.

This approach ensures efficient state synchronization while minimizing latency and resource usage. For production, a persistent database could be integrated to handle larger-scale data storage and retrieval.

## Future Improvements

Given more time, the following improvements could be implemented:

- Persist messages using a database (e.g. PostgreSQL or Redis) instead of in-memory storage
- Add authentication and user identity persistence
- Improve error handling and reconnection strategies
- Add E2E tests for real-time message flow
