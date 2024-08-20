import { Config } from "payload/config";
import { CollectionBeforeLoginHook } from "payload/types";
import { TenancyOptions } from "../options";
/**
 * Restrict login to only authorized tenants if isolation strategy is set to
 * "path".
 *
 * @returns
 */
export declare const createRestrictLogin: ({ options, }: {
    options: TenancyOptions;
    config: Config;
}) => CollectionBeforeLoginHook;
