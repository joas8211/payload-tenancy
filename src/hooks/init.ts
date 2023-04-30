import { Application, Handler } from "express";
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

/**
 * Check if middleware already exists in the application. Used to make sure that
 * middleware is not inserted multiple times.
 *
 * @param express Express application
 * @param middleware Middleware handler to check
 * @returns True if middleware exists already in the application
 */
const middlewareExists = (express: Application, middleware: Handler): boolean =>
  express._router.stack.some((layer) => layer.handle === middleware);

export const createInitHook = ({
  options,
  config,
}: {
  options: TenancyOptions;
  config: Config;
}): InitHook => {
  let middleware: Handler | undefined;

  return async (payload: Payload) => {
    await config.onInit?.(payload);

    if (!payload.express) {
      return;
    }

    if (!middleware) {
      // Choose a middleware to use.
      if (options.isolationStrategy === "path") {
        middleware = createPathMapping({ options, config, payload });
      }
      if (options.isolationStrategy === "domain") {
        middleware = createDomainMapping({ options, config, payload });
      }
    }

    if (middleware && !middlewareExists(payload.express, middleware)) {
      // Middleware chosen and does not exist already.
      payload.express.use(middleware);
      prioritizeLastMiddleware(payload.express);
    }
  };
};
