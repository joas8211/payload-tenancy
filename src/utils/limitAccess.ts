import { AccessResult } from "payload/config";
import { Where } from "payload/types";

/**
 * @param originalResult Original access control (query condition or boolean
 *   result) to take into account.
 * @param condition Query condition for limiting the original access control.
 * @returns Limited access control.
 */
export const limitAccess = (
  originalResult: AccessResult = true,
  condition: Where,
): AccessResult => {
  if (originalResult === false) {
    return false;
  }
  if (originalResult === true) {
    return condition;
  }
  return { and: [originalResult, condition] };
};
