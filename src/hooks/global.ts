import {
  AfterChangeHook,
  BeforeChangeHook,
  BeforeReadHook,
  GlobalConfig,
} from "payload/dist/globals/config/types";
import { RequestWithTenant } from "../utils/requestWithTenant";
import { TenancyOptions } from "../options";
import { Config } from "payload/config";
import { PayloadRequest } from "payload/types";

export const createGlobalBeforeReadHook =
  ({
    options,
    config,
    global,
  }: {
    options: TenancyOptions;
    config: Config;
    global: GlobalConfig;
  }): BeforeReadHook =>
  async ({ req }) => {
    let doc = await getGlobal({
      options,
      config,
      global,
      req,
    });

    if (!doc) {
      doc = await initGlobal({ options, config, global, req });
    }

    return doc;
  };

export const createGlobalBeforeChangeHook =
  ({
    options,
    config,
    global,
  }: {
    options: TenancyOptions;
    config: Config;
    global: GlobalConfig;
  }): BeforeChangeHook =>
  async ({ data, req }) => {
    const doc = await getGlobal({
      options,
      config,
      global,
      req,
    });

    if (!doc) {
      await initGlobal({ options, config, global, req, data });
    } else {
      await updateGlobal({ options, config, global, req, data });
    }

    return {};
  };

export const createGlobalAfterChangeHook =
  ({
    options,
    config,
    global,
  }: {
    options: TenancyOptions;
    config: Config;
    global: GlobalConfig;
  }): AfterChangeHook =>
  ({ req }) =>
    getGlobal({
      options,
      config,
      global,
      req,
    });

const extractTenantId = ({
  req,
}: {
  options: TenancyOptions;
  req: PayloadRequest;
}) => {
  const tenantId =
    (req as RequestWithTenant).tenant?.id ??
    (req as RequestWithTenant).tenant ??
    req.user?.tenant?.id ??
    req.user?.tenant;
  if (!tenantId) {
    throw new Error(
      "Could not determine tenant." +
        " You can select tenant by setting it in user object when using Local API.",
    );
  }
  return tenantId;
};

const initGlobal = ({
  options,
  global,
  req,
  data,
}: {
  options: TenancyOptions;
  config: Config;
  global: GlobalConfig;
  req: PayloadRequest;
  data?: Record<string, unknown>;
}) =>
  req.payload.create({
    req,
    collection: global.slug + "Globals",
    data: {
      ...(data ?? {}),
      tenant: extractTenantId({ options, req }),
    },
  });

const updateGlobal = ({
  options,
  global,
  req,
  data,
}: {
  options: TenancyOptions;
  config: Config;
  global: GlobalConfig;
  req: PayloadRequest;
  data?: Record<string, unknown>;
}) =>
  req.payload.update({
    req,
    collection: global.slug + "Globals",
    where: {
      tenant: {
        equals: extractTenantId({ options, req }),
      },
    },
    data: {
      ...(data ?? {}),
      tenant: extractTenantId({ options, req }),
    },
  });

const getGlobal = async ({
  options,
  global,
  req,
}: {
  options: TenancyOptions;
  config: Config;
  global: GlobalConfig;
  req: PayloadRequest;
}) => {
  const {
    docs: [doc],
  } = await req.payload.find({
    req,
    collection: global.slug + "Globals",
    where: {
      tenant: {
        equals: extractTenantId({ options, req }),
      },
    },
    depth: 0,
    limit: 1,
  });
  return doc;
};
