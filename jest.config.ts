import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
  testEnvironment: "jest-environment-puppeteer",
  testTimeout: 10_000,
  forceExit: true,
};

export default jestConfig;
