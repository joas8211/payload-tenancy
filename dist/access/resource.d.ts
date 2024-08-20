import { Access, Config } from "payload/config";
import { TenancyOptions } from "../options";
/**
 * Limits resource access to resources that belong to the same tenant based on
 * user's tenant ("user" strategy) or requested tenant ("path" or "domain"
 * strategy).
 *
 * @returns Collection access control for generic resources
 */
export declare const createResourceReadAccess: ({ options, original, }: {
    options: TenancyOptions;
    config: Config;
    /** Original access control to take into account. */
    original?: Access;
}) => Access;
/**
 * Limits resource creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for generic resources
 */
export declare const createResourceCreateAccess: ({ options, original, }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
}) => Access;
