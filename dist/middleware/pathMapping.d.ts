import { Handler } from "express";
import { Payload } from "payload";
import { Config } from "payload/config";
import { TenancyOptions } from "../options";
/**
 * Map the requested path to correct tenant. Adds the tenant to the request
 * object.
 *
 * @returns Express middleware
 */
export declare const createPathMapping: ({ options, config, payload, }: {
    options: TenancyOptions;
    config: Config;
    payload: Payload;
}) => Handler;
