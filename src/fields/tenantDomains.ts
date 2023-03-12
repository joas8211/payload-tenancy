import { Config } from "payload/config";
import { Field } from "payload/types";
import { TenancyOptions } from "../options";

const hostnamePattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;

export const createTenantDomainsField: (arg: {
  options: TenancyOptions;
  config: Config;
}) => Field = () => ({
  type: "array",
  name: "domains",
  fields: [
    {
      type: "text",
      name: "domain",
      validate: (value) =>
        hostnamePattern.test(value) || "Domain is not valid.",
    },
  ],
  admin: {
    components: {
      RowLabel: ({ data }) => data.domain || "New Domain",
    },
  },
});
