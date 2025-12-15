import type { Config } from "jest"

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    projects: ["<rootDir>/apps/*/jest.config.ts"],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/.jest/setup.ts"],
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
}

export default config
