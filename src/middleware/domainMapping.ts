import { Handler, Request } from "express";
import { Payload } from "payload";
import { Config } from "payload/config";
import { TenancyOptions } from "../options";

/**
 * Map the requested hostname to correct tenant. Adds the tenant to the request
 * object.
 *
 * @returns Express middleware
 */
export const createDomainMapping =
  ({
    options,
    payload,
  }: {
    options: TenancyOptions;
    config: Config;
    payload: Payload;
  }): Handler =>
  async (req: Request & { tenant?: string }, res, next) => {
    // Check that tenant exists and attach it to the request.
    req.tenant = (
      await payload.find({
        collection: options.tenantCollection,
        where: { "domains.domain": { equals: req.hostname } },
      })
    ).docs[0];
    if (!req.tenant) {
      res.status(404).send();
      return;
    }

    next();
  };
