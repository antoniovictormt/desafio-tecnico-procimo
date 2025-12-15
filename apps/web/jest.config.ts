import type { Config } from "jest"
const { name } = require("./package.json")

const config: Config = {
    displayName: name,
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/src/**/*.spec.ts"]
}

export default config
