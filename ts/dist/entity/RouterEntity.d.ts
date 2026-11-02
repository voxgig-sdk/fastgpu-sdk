import { FastgpuEntityBase } from '../FastgpuEntityBase';
import type { FastgpuSDK } from '../FastgpuSDK';
import type { Control } from '../types';
import type { Router, RouterCreateData, RouterRemoveMatch } from '../FastgpuTypes';
declare class RouterEntity extends FastgpuEntityBase<Router> {
    constructor(client: FastgpuSDK, entopts: any);
    make(this: RouterEntity): RouterEntity;
    create(this: any, reqdata?: RouterCreateData, ctrl?: Control): Promise<RouterEntity>;
    remove(this: any, reqmatch?: RouterRemoveMatch, ctrl?: Control): Promise<RouterEntity>;
}
export { RouterEntity };
