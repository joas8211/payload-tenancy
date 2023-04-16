import type { Config } from "jest";

const jestConfig: Config = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/mocks/file.ts",
    "\\.(css|scss)$": "<rootDir>/tests/mocks/emptyModule.ts",
  },
  globalSetup: "jest-environment-puppeteer/setup",
  globalTeardown: "jest-environment-puppeteer/teardown",
  testEnvironment: "<rootDir>/tests/environment.ts",
  testTimeout: 60_000,
  forceExit: true,
};

export default jestConfig;
