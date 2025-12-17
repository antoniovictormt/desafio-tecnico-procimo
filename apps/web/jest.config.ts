import type { Config } from "jest"

const config: Config = {
    displayName: "desafio-tecnico-procimo/web",
    preset: "ts-jest",
    testEnvironment: "jsdom",

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },

    coveragePathIgnorePatterns: [
        "<rootDir>/src/components/ui/",
        "<rootDir>/.jest/*.ts"
    ],

    collectCoverageFrom: ["src/**/*.ts(x)?", "!src/**/*.d.ts"],

    testMatch: ["<rootDir>/src/**/*.test.ts(x)?"]
}

export default config
