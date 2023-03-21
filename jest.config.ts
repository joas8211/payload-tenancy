import type { Config } from "jest";

const jestConfig: Config = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
  testEnvironment: "<rootDir>/tests/environment.ts",
  testTimeout: 60_000,
  forceExit: true,
};

export default jestConfig;
