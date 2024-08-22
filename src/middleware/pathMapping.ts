import { Handler } from "express";
import { Payload } from "payload";
import { Config } from "payload/config";
import { TenancyOptions } from "../options";
import { RequestWithTenant } from "../utils/requestWithTenant";

/**
 * Map the requested path to correct tenant. Adds the tenant to the request
 * object.
 *
 * @returns Express middleware
 */
export const createPathMapping =
  ({
    options,
    config,
    payload,
  }: {
    options: TenancyOptions;
    config: Config;
    payload: Payload;
  }): Handler =>
  async (req: RequestWithTenant, res, next) => {
    // Allow to access any admin resources like JavaScript bundles.
    const adminRoute = config.routes?.admin || "/admin";
    if (new RegExp(`^${adminRoute}(/@|.*\\.[^/]+$)`).test(req.url)) {
      next();
      return;
    }

    // Deny access to the normal admin route.
    if (req.url === adminRoute || req.url.startsWith(adminRoute + "/")) {
      res.status(404).send();
      return;
    }

    // There must be a path with at least one segment and that segment is tenant
    // slug.
    const encodedTenantSlug = req.url
      .slice(1)
      .split("/")
      .slice(0, 2)
      .map((a) => decodeURIComponent(a))
      .join("/");
    if (!encodedTenantSlug) {
      res.status(404).send();
      return;
    }

    // Check that tenant exists and attach it to the request.
    req.tenant = (
      await payload.find({
        collection: options.tenantCollection,
        where: { slug: { equals: decodeURIComponent(encodedTenantSlug) } },
      })
    ).docs[0];

    // Remove tenant slug from the request URL so it can be processed normally
    // by payload.
    if (req.tenant) {
      req.url = req.url.slice(`/${encodedTenantSlug}`.length);
    }

    next();
  };
