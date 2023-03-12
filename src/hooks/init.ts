import { Application } from "express";
import { Payload } from "payload";
import { Config } from "payload/config";
import { TenancyOptions } from "../options";
import { createPathMapping } from "../middleware/pathMapping";
import { createDomainMapping } from "../middleware/domainMapping";

export type InitHook = (payload: Payload) => void | Promise<void>;

/**
 * Move the last middleware up in the stack as far as possible (after
 * "expressInit" middleware).
 *
 * @param express Express application
 */
const prioritizeLastMiddleware = (express: Application) => {
  const router = express._router;
  const index = router.stack.findIndex((layer) => layer.name === "expressInit");
  router.stack = [
    ...router.stack.slice(0, index + 1),
    ...router.stack.slice(-1),
    ...router.stack.slice(index + 1, -1),
  ];
};

export const createInitHook =
  ({
    options,
    config,
  }: {
    options: TenancyOptions;
    config: Config;
  }): InitHook =>
  async (payload: Payload) => {
    await config.onInit?.(payload);

    if (!payload.express) {
      return;
    }

    if (options.isolationStrategy === "path") {
      payload.express.use(createPathMapping({ options, config, payload }));
      prioritizeLastMiddleware(payload.express);
    }

    if (options.isolationStrategy === "domain") {
      payload.express.use(createDomainMapping({ options, config, payload }));
      prioritizeLastMiddleware(payload.express);
    }
  };
