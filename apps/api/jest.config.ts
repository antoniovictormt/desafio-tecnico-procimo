import type { Config } from "jest"

const config: Config = {
    displayName: "desafio-tecnico-procimo/api",
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/src/**/*.test.ts"]
}

export default config
