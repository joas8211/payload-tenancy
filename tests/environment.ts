import PuppeteerEnvironment from "jest-environment-puppeteer";
import { initPayload } from "./payload";
import { dirname, join } from "path";
import swcRegister from "@swc/register";
import { stat } from "fs/promises";

const findClosestFile = async (
  dir: string,
  filename: string,
  rootDir: string,
) => {
  while (
    await stat(join(dir, filename))
      .then((stats) => !stats.isFile())
      .catch(() => true)
  ) {
    dir = dirname(dir);
    if (!dir || dir === "/" || dir === rootDir) {
      throw new Error(`Could not find ${filename} close to directory ${dir}`);
    }
  }
  return join(dir, filename);
};

class CustomTestEnvironment extends PuppeteerEnvironment {
  private rootDir: string;
  private testPath: string;
  private closeServer: (() => Promise<void>) | undefined;

  constructor(config, context) {
    super(config, context);
    this.rootDir = config.rootDir;
    this.testPath = context.testPath;
  }

  async setup(): Promise<void> {
    await super.setup();

    if (/[/\\.](admin|local|rest|graphql)\.test\.ts$/.test(this.testPath)) {
      const configPath = await findClosestFile(
        dirname(this.testPath),
        "payload.config.ts",
        this.rootDir,
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

      const { close, instance, url, reset } = await initPayload(configPath);
      this.closeServer = close;
      this.global.payload = instance;
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
