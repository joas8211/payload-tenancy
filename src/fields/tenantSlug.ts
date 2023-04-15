import { Config } from "payload/config";
import { Field } from "payload/types";
import { TenancyOptions } from "../options";

/** @returns Slug field for tenants. */
export const createTenantSlugField: (arg: {
  options: TenancyOptions;
  config: Config;
}) => Field = () => ({
  type: "text",
  name: "slug",
  unique: true,
  required: true,
});
