import type { Config } from "jest"

const config: Config = {
    displayName: "desafio-tecnico-procimo/api",
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/src/**/*.spec.ts"]
}

export default config
