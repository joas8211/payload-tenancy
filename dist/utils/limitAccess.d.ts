import { AccessResult } from "payload/config";
import { Where } from "payload/types";
/**
 * @param originalResult Original access control (query condition or boolean
 *   result) to take into account.
 * @param condition Query condition for limiting the original access control.
 * @returns Limited access control.
 */
export declare const limitAccess: (originalResult: AccessResult, condition: Where) => AccessResult;
