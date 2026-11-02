import { FastgpuEntityBase } from '../FastgpuEntityBase';
import type { FastgpuSDK } from '../FastgpuSDK';
import type { Control } from '../types';
import type { Price, PriceLoadMatch, PriceListMatch } from '../FastgpuTypes';
declare class PriceEntity extends FastgpuEntityBase<Price> {
    constructor(client: FastgpuSDK, entopts: any);
    make(this: PriceEntity): PriceEntity;
    load(this: any, reqmatch?: PriceLoadMatch, ctrl?: Control): Promise<PriceEntity>;
    list(this: any, reqmatch?: PriceListMatch, ctrl?: Control): Promise<PriceEntity[]>;
}
export { PriceEntity };
