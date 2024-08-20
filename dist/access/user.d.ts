import { Access, Config } from "payload/config";
import { TenancyOptions } from "../options";
/**
 * Limits user access to users that belong to the same or above tenant.
 *
 * @returns Collection access control for users
 */
export declare const createUserReadAccess: ({ options, original, }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
}) => Access;
/**
 * Limits user creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for users
 */
export declare const createUserCreateAccess: ({ options, original, }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
}) => Access;
