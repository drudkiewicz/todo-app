/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[jt]s"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.test.ts"],
  transform: {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!variables/.*)"],
  coverageDirectory: "coverage",
};
