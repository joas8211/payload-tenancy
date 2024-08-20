import { Payload } from "payload";
import { Config } from "payload/config";
import { TenancyOptions } from "../options";
export type InitHook = (payload: Payload) => void | Promise<void>;
export declare const createInitHook: ({ options, config, }: {
    options: TenancyOptions;
    config: Config;
}) => InitHook;
