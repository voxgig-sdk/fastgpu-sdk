import { FastgpuEntityBase } from '../FastgpuEntityBase';
import type { FastgpuSDK } from '../FastgpuSDK';
import type { Control } from '../types';
import type { Match, MatchListMatch } from '../FastgpuTypes';
declare class MatchEntity extends FastgpuEntityBase<Match> {
    constructor(client: FastgpuSDK, entopts: any);
    make(this: MatchEntity): MatchEntity;
    list(this: any, reqmatch?: MatchListMatch, ctrl?: Control): Promise<MatchEntity[]>;
}
export { MatchEntity };
