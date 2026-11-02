import { MatchEntity } from './entity/MatchEntity';
import { PriceEntity } from './entity/PriceEntity';
import { RouterEntity } from './entity/RouterEntity';
export type * from './FastgpuTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { FastgpuEntityBase } from './FastgpuEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class FastgpuSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Match(entopts?: Record<string, any>): MatchEntity;
    Price(entopts?: Record<string, any>): PriceEntity;
    Router(entopts?: Record<string, any>): RouterEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): FastgpuSDK;
    tester(testopts?: any, sdkopts?: any): FastgpuSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof FastgpuSDK;
export { stdutil, config, BaseFeature, FastgpuEntityBase, FastgpuSDK, SDK, };
export type { DirectResult };
