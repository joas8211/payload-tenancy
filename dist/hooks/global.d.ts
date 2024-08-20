import { AfterChangeHook, BeforeChangeHook, BeforeReadHook, GlobalConfig } from "payload/dist/globals/config/types";
import { TenancyOptions } from "../options";
import { Config } from "payload/config";
export declare const createGlobalBeforeReadHook: ({ options, config, global, }: {
    options: TenancyOptions;
    config: Config;
    global: GlobalConfig;
}) => BeforeReadHook;
export declare const createGlobalBeforeChangeHook: ({ options, config, global, }: {
    options: TenancyOptions;
    config: Config;
    global: GlobalConfig;
}) => BeforeChangeHook;
export declare const createGlobalAfterChangeHook: ({ options, config, global, }: {
    options: TenancyOptions;
    config: Config;
    global: GlobalConfig;
}) => AfterChangeHook;
