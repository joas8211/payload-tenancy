import { Payload } from "payload";
import { Access } from "payload/types";
import { TenancyOptions } from "../options";
/**
 * By default, the collection requires user to be logged in and to belong to an
 * authorized tenant.
 *
 * @returns Default access for all collections.
 */
export declare const createDefaultAccess: ({ options, payload, }: {
    options: TenancyOptions;
    payload: Payload;
}) => Access;
