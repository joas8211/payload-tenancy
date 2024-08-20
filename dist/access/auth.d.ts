import { Config } from "payload/config";
import { TenancyOptions } from "../options";
/**
 * Limits access to admin UI based on isolation strategy. Only "path" and
 * "domain" strategies are restricted.
 *
 * @returns Collection access control for admin UI
 */
export declare const createAdminAccess: ({ options, original, }: {
    options: TenancyOptions;
    config: Config;
    /** Original access control to take into account. */
    original?: (args: unknown) => boolean | Promise<boolean>;
}) => (args: any) => Promise<boolean>;
