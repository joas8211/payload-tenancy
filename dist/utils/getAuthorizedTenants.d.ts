import { Payload } from "payload";
import { TenancyOptions } from "../options";
/**
 * @returns All tenant IDs that the tenant has access to. Output will be the
 *   inputted tenant ID and all sub-tenant IDs.
 */
export declare const getAuthorizedTenants: ({ options, payload, tenantId, }: {
    options: TenancyOptions;
    payload: Payload;
    /** The tenant who's authorization to list */
    tenantId: string;
}) => Promise<string[]>;
