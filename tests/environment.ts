import PuppeteerEnvironment from "jest-environment-puppeteer";
import { findClosestFile, initPayload } from "./utils";
import { dirname } from "path";
import swcRegister from "@swc/register";

class CustomTestEnvironment extends PuppeteerEnvironment {
  private rootDir: string;
  private testPath: string;
  private closeServer: (() => Promise<void>) | undefined;

  constructor(config, context) {
    super(config);
    this.rootDir = config.rootDir;
    this.testPath = context.testPath;
  }

  async setup(): Promise<void> {
    await super.setup();

    if (/[/\\.](admin|rest)\.test\.ts$/.test(this.testPath)) {
      const configPath = await findClosestFile(
        dirname(this.testPath),
        "payload.config.ts",
        this.rootDir
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - bad @swc/register types
      swcRegister({
        sourceMaps: "inline",
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
        },
        module: {
          type: "commonjs",
        },
      });

      const { close, url, reset } = await initPayload(configPath);
      this.closeServer = close;
      this.global.payloadUrl = url;
      this.global.payloadReset = reset;
    }
  }

  async teardown(): Promise<void> {
    await super.teardown();
    await this.closeServer?.();
  }
}

export default CustomTestEnvironment;
