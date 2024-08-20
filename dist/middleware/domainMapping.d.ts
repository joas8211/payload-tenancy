import { Handler } from "express";
import { Payload } from "payload";
import { Config } from "payload/config";
import { TenancyOptions } from "../options";
/**
 * Map the requested hostname to correct tenant. Adds the tenant to the request
 * object.
 *
 * @returns Express middleware
 */
export declare const createDomainMapping: ({ options, payload, }: {
    options: TenancyOptions;
    config: Config;
    payload: Payload;
}) => Handler;
