"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('MatchEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when FASTGPU_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('FASTGPU_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.FastgpuSDK.test();
        const ent = testsdk.Match();
        (0, node_assert_1.default)(null != ent);
    });
    class FailHook extends __1.BaseFeature {
        name = 'failhook';
        version = '0.0.1';
        active = true;
        unexpected = 0;
        init() { }
        PreSpec() { throw new Error('match hook failed'); }
        PreUnexpected() { this.unexpected++; }
    }
    (0, node_test_1.test)('stream-error', async () => {
        const offline = { net: { offline: true } };
        await node_assert_1.default.rejects(async () => {
            for await (const _item of __1.FastgpuSDK.test(offline).Match().stream('list')) { }
        }, /offline/);
        for await (const _item of __1.FastgpuSDK.test(offline).Match()
            .stream('list', undefined, { ctrl: { throw: false } })) { }
        if (null != __1.config.feature?.rbac) {
            const denied = __1.FastgpuSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } });
            await node_assert_1.default.rejects(async () => {
                for await (const _item of denied.Match().stream('list')) { }
            }, (err) => 'rbac_denied' === err.code);
        }
    });
    (0, node_test_1.test)('stream-ctrl', async () => {
        const explain = {};
        const ctrl = { explain };
        for await (const _item of __1.FastgpuSDK.test().Match().stream('list', undefined, { ctrl })) { }
        node_assert_1.default.deepStrictEqual(Object.keys(ctrl), ['explain']);
        (0, node_assert_1.default)(explain === ctrl.explain && 0 < Object.keys(explain).length);
    });
    (0, node_test_1.test)('unexpected', async () => {
        const hook = new FailHook();
        const client = new __1.FastgpuSDK({ feature: { test: { active: true } }, extend: [hook] });
        await node_assert_1.default.rejects(client.Match().list(), /hook failed/);
        (0, node_assert_1.default)(0 < hook.unexpected);
        const fired = hook.unexpected;
        node_assert_1.default.strictEqual(await client.Match().list(undefined, { throw: false }), undefined);
        (0, node_assert_1.default)(fired < hook.unexpected);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.FastgpuSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Match().list({ "budget_usd_hr": "x", "query": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.FASTGPU_TEST_LIVE;
        for (const op of ['list']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'match.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "billed_hours": { "a": true, "h": "Billed Hours", "n": "billed_hours", "r": false, "sh": "Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter.", "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "billed_hours", "index$": 0 }, "billing_increment": { "a": true, "h": "Billing Increment", "n": "billing_increment", "r": false, "sh": "How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure.", "t": "`$STRING`", "key$": "billing_increment", "index$": 1 }, "effective_usd_hr": { "a": true, "h": "Effective Usd Hr", "n": "effective_usd_hr", "r": false, "t": "`$NUMBER`", "key$": "effective_usd_hr", "index$": 2 }, "estimated_total_usd": { "a": true, "h": "Estimated Total Usd", "n": "estimated_total_usd", "r": false, "sh": "effective_usd_hr times billed_hours, rounded up to the cent.", "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "estimated_total_usd", "index$": 3 }, "fetched_at": { "a": true, "h": "Fetched At", "n": "fetched_at", "r": false, "sh": "When this price was fetched from the provider (ISO 8601).", "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "fetched_at", "index$": 4 }, "fits_single_card": { "a": true, "h": "Fits Single Card", "n": "fits_single_card", "r": false, "t": "`$BOOLEAN`", "key$": "fits_single_card", "index$": 5 }, "gpu": { "a": true, "h": "Gpu", "n": "gpu", "r": false, "t": "`$STRING`", "key$": "gpu", "index$": 6 }, "gpu_count": { "a": true, "h": "Gpu Count", "n": "gpu_count", "r": false, "t": "`$INTEGER`", "key$": "gpu_count", "index$": 7 }, "monthly_usd": { "a": true, "h": "Monthly Usd", "n": "monthly_usd", "r": false, "t": "`$NUMBER`", "key$": "monthly_usd", "index$": 8 }, "offer_type": { "a": true, "h": "Offer Type", "n": "offer_type", "r": false, "t": "`$STRING`", "key$": "offer_type", "index$": 9 }, "over_budget": { "a": true, "h": "Over Budget", "n": "over_budget", "r": false, "t": "`$BOOLEAN`", "key$": "over_budget", "index$": 10 }, "page_url": { "a": true, "h": "Page Url", "n": "page_url", "r": false, "sh": "Absolute URL of this GPU's live price page, with every live offer.", "t": "`$STRING`", "key$": "page_url", "index$": 11 }, "partner": { "a": true, "h": "Partner", "n": "partner", "r": false, "t": "`$BOOLEAN`", "key$": "partner", "index$": 12 }, "provider": { "a": true, "h": "Provider", "n": "provider", "r": false, "t": "`$STRING`", "key$": "provider", "index$": 13 }, "provider_label": { "a": true, "h": "Provider Label", "n": "provider_label", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "provider_label", "index$": 14 }, "quote_age_seconds": { "a": true, "h": "Quote Age Seconds", "n": "quote_age_seconds", "r": false, "sh": "Seconds between fetched_at and as_of.", "t": ["`$ONE`", ["`$INTEGER`", "`$NULL`"]], "key$": "quote_age_seconds", "index$": 15 }, "reason": { "a": true, "h": "Reason", "n": "reason", "r": false, "t": "`$STRING`", "key$": "reason", "index$": 16 }, "reliability": { "a": true, "h": "Reliability", "n": "reliability", "r": false, "t": "`$STRING`", "key$": "reliability", "index$": 17 }, "score": { "a": true, "h": "Score", "n": "score", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "score", "index$": 18 }, "tokens_per_sec": { "a": true, "h": "Tokens Per Sec", "n": "tokens_per_sec", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "tokens_per_sec", "index$": 19 }, "url": { "a": true, "h": "Url", "n": "url", "r": false, "sh": "Site-relative path of this GPU's live price page, e.g.", "t": "`$STRING`", "key$": "url", "index$": 20 }, "usd_per_million_tokens": { "a": true, "h": "Usd Per Million Tokens", "n": "usd_per_million_tokens", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "usd_per_million_tokens", "index$": 21 } }, "name": "match", "op": { "list": { "input": "data", "name": "list", "points": [{ "a": true, "co": { "id": "GET /api/v1/match", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "budget_usd_hr", "or": "budget_usd_hr", "r": false, "t": "`$NUMBER`", "index$": 0 }, { "a": true, "k": "query", "n": "duration_hour", "or": "duration_hours", "r": false, "t": "`$NUMBER`", "index$": 1 }, { "a": true, "k": "query", "n": "gpu_count", "or": "gpu_count", "r": false, "t": "`$INTEGER`", "index$": 2 }, { "a": true, "k": "query", "n": "max_quote_age_minute", "or": "max_quote_age_minutes", "r": false, "t": "`$NUMBER`", "index$": 3 }, { "a": true, "k": "query", "n": "max_total_usd", "or": "max_total_usd", "r": false, "t": "`$NUMBER`", "index$": 4 }, { "a": true, "k": "query", "n": "min_gpu_memory_gb", "or": "min_gpu_memory_gb", "r": false, "t": "`$INTEGER`", "index$": 5 }, { "a": true, "k": "query", "n": "model", "or": "model", "r": false, "t": "`$STRING`", "index$": 6 }, { "a": true, "k": "query", "n": "params_b", "or": "params_b", "r": false, "t": "`$NUMBER`", "index$": 7 }, { "a": true, "k": "query", "n": "precision", "or": "precision", "r": false, "t": "`$STRING`", "index$": 8 }, { "a": true, "ex": "cheapest to serve Llama 3 70B", "k": "query", "n": "query", "or": "query", "r": true, "t": "`$STRING`", "index$": 9 }, { "a": true, "k": "query", "n": "region", "or": "region", "r": false, "t": "`$STRING`", "index$": 10 }, { "a": true, "k": "query", "n": "reserved", "or": "reserved", "r": false, "t": "`$STRING`", "index$": 11 }, { "a": true, "k": "query", "n": "spot", "or": "spot", "r": false, "t": "`$STRING`", "index$": 12 }, { "a": true, "k": "query", "n": "task", "or": "task", "r": false, "t": "`$STRING`", "index$": 13 }, { "a": true, "k": "query", "n": "vram_gb", "or": "vram_gb", "r": false, "t": "`$INTEGER`", "index$": 14 }, { "a": true, "k": "query", "n": "weights_gb", "or": "weights_gb", "r": false, "t": "`$NUMBER`", "index$": 15 }] }, "k": "http", "m": "GET", "o": "/api/v1/match", "q": { "exist": ["query"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "v1" }, { "lit": "match" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "list" } }, "relations": { "ancestors": [] }, "key$": "match", "name__orig": "match", "Name": "Match", "name_": "match", "name-": "match", "NAME": "MATCH", "index$": 0 }, { "active": true, "entity": "match", "key$": "BasicMatchFlow", "kind": "basic", "name": "BasicMatchFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": {}, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemExists", "def": { "ref": "match_ref01" } }], "index$": 0 }] }, 'Match', { "GET /api/v1/match": { "protocol": "http", "parameters": [{ "name": "query", "in": "query", "required": true, "description": "Plain-language job, e.g. \"cheapest to serve Llama 3 70B\", \"2x H100 for fine-tuning\" or \"a GPU with 80GB of memory\". Provide this OR a structured spec below.", "schema": { "type": "string" }, "example": "cheapest to serve Llama 3 70B", "index$": 0 }, { "name": "model", "in": "query", "required": false, "description": "Open model name to size against, e.g. \"Llama 3 70B\", \"Qwen 72B\", \"Mixtral\".", "schema": { "type": "string" }, "index$": 1 }, { "name": "params_b", "in": "query", "required": false, "description": "Model size in billions of parameters when no exact model is named.", "schema": { "type": "number" }, "index$": 2 }, { "name": "weights_gb", "in": "query", "required": false, "description": "Measured size of the weights as stored, in GB: the file you will load (for example a GGUF Q4_K_M build, which holds more bits per parameter than its nominal 4). Replaces parameters times bytes per parameter in the memory estimate. Used for a model sized by its parameter count; the answer's workload.weights_gb is null when it was not (an image or speech model sized as a whole pipeline).", "schema": { "type": "number" }, "index$": 3 }, { "name": "vram_gb", "in": "query", "required": false, "description": "Rough VRAM the job needs, in GB, if you already know it.", "schema": { "type": "integer" }, "index$": 4 }, { "name": "task", "in": "query", "required": false, "description": "What the job does.", "schema": { "type": "string", "enum": ["inference", "finetune-lora", "finetune-full", "generate", "transcribe", "embed"] }, "index$": 5 }, { "name": "precision", "in": "query", "required": false, "description": "Numeric precision to size the model at.", "schema": { "type": "string", "enum": ["fp16", "int8", "int4"] }, "index$": 6 }, { "name": "gpu_count", "in": "query", "required": false, "description": "Exact positive GPU count. Overrides a count in query text. Returns no matches if no supported configuration fits; omit for automatic sizing.", "schema": { "type": "integer" }, "index$": 7 }, { "name": "min_gpu_memory_gb", "in": "query", "required": false, "description": "Memory each GPU card must have, in GB (e.g. 80 for 80GB-class cards such as the H100 or A100 80GB). Smaller cards are never returned. On its own it lists every card that size, cheapest first.", "schema": { "type": "integer" }, "index$": 8 }, { "name": "budget_usd_hr", "in": "query", "required": false, "description": "Hard limit on the hourly price of the whole configuration, in USD. Configurations above it are not returned.", "schema": { "type": "number" }, "index$": 9 }, { "name": "duration_hours", "in": "query", "required": false, "description": "How long the job will run, in hours (fractions are fine). When sent, each match carries billed_hours and estimated_total_usd.", "schema": { "type": "number" }, "index$": 10 }, { "name": "max_total_usd", "in": "query", "required": false, "description": "Hard limit on estimated_total_usd, the GPU rental cost of the whole job, in USD. Needs duration_hours. Configurations above it are not returned.", "schema": { "type": "number" }, "index$": 11 }, { "name": "max_quote_age_minutes", "in": "query", "required": false, "description": "Hard limit on how old a price quote may be, in minutes. Configurations whose price was fetched from the provider longer ago are not returned.", "schema": { "type": "number" }, "index$": 12 }, { "name": "region", "in": "query", "required": false, "description": "Restrict to a data-residency region.", "schema": { "type": "string", "enum": ["US", "EU", "ASIA"] }, "index$": 13 }, { "name": "spot", "in": "query", "required": false, "description": "Set true to include interruptible spot capacity for a cheaper rate.", "schema": { "type": "string", "enum": ["true", "false"] }, "index$": 14 }, { "name": "reserved", "in": "query", "required": false, "description": "Set true to include reserved / committed-term capacity for a lower rate.", "schema": { "type": "string", "enum": ["true", "false"] }, "index$": 15 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let match_ref01_data = Object.values(setup.data.existing.match)[0];
        // LIST
        const match_ref01_ent = client.Match();
        const match_ref01_match = {};
        const match_ref01_list = (await match_ref01_ent.list(match_ref01_match)).map((e) => e.data());
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/match/MatchTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.FastgpuSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['match01', 'match02', 'match03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'FASTGPU_TEST_MATCH_ENTID': idmap,
        'FASTGPU_TEST_LIVE': 'FALSE',
        'FASTGPU_TEST_EXPLAIN': 'FALSE',
        'FASTGPU_APIKEY': '',
    });
    idmap = env['FASTGPU_TEST_MATCH_ENTID'];
    const live = 'TRUE' === env.FASTGPU_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['FASTGPU_TEST_MATCH_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.FastgpuSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {
                apikey: env.FASTGPU_APIKEY,
            },
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.FASTGPU_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=MatchEntity.test.js.map