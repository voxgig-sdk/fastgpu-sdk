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
(0, node_test_1.describe)('PriceEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when FASTGPU_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('FASTGPU_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.FastgpuSDK.test();
        const ent = testsdk.Price();
        (0, node_assert_1.default)(null != ent);
    });
    class FailHook extends __1.BaseFeature {
        name = 'failhook';
        version = '0.0.1';
        active = true;
        unexpected = 0;
        init() { }
        PreSpec() { throw new Error('price hook failed'); }
        PreUnexpected() { this.unexpected++; }
    }
    (0, node_test_1.test)('stream-error', async () => {
        const offline = { net: { offline: true } };
        await node_assert_1.default.rejects(async () => {
            for await (const _item of __1.FastgpuSDK.test(offline).Price().stream('list')) { }
        }, /offline/);
        for await (const _item of __1.FastgpuSDK.test(offline).Price()
            .stream('list', undefined, { ctrl: { throw: false } })) { }
        if (null != __1.config.feature?.rbac) {
            const denied = __1.FastgpuSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } });
            await node_assert_1.default.rejects(async () => {
                for await (const _item of denied.Price().stream('list')) { }
            }, (err) => 'rbac_denied' === err.code);
        }
    });
    (0, node_test_1.test)('stream-ctrl', async () => {
        const explain = {};
        const ctrl = { explain };
        for await (const _item of __1.FastgpuSDK.test().Price().stream('list', undefined, { ctrl })) { }
        node_assert_1.default.deepStrictEqual(Object.keys(ctrl), ['explain']);
        (0, node_assert_1.default)(explain === ctrl.explain && 0 < Object.keys(explain).length);
    });
    (0, node_test_1.test)('unexpected', async () => {
        const hook = new FailHook();
        const client = new __1.FastgpuSDK({ feature: { test: { active: true } }, extend: [hook] });
        await node_assert_1.default.rejects(client.Price().list(), /hook failed/);
        (0, node_assert_1.default)(0 < hook.unexpected);
        const fired = hook.unexpected;
        node_assert_1.default.strictEqual(await client.Price().list(undefined, { throw: false }), undefined);
        (0, node_assert_1.default)(fired < hook.unexpected);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.FastgpuSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Price().list({ "date": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.FASTGPU_TEST_LIVE;
        for (const op of ['list', 'load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'price.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "arch": { "a": true, "h": "Arch", "n": "arch", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "arch", "index$": 0 }, "carried_providers": { "a": true, "h": "Carried Providers", "n": "carried_providers", "r": false, "t": "`$INTEGER`", "key$": "carried_providers", "index$": 1 }, "cheapest_billed_separately": { "a": true, "h": "Cheapest Billed Separately", "n": "cheapest_billed_separately", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "cheapest_billed_separately", "index$": 2 }, "cheapest_min_gpu_count": { "a": true, "h": "Cheapest Min Gpu Count", "n": "cheapest_min_gpu_count", "r": false, "t": ["`$ONE`", ["`$INTEGER`", "`$NULL`"]], "key$": "cheapest_min_gpu_count", "index$": 3 }, "cheapest_provider": { "a": true, "h": "Cheapest Provider", "n": "cheapest_provider", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "cheapest_provider", "index$": 4 }, "cheapest_usd_hr": { "a": true, "h": "Cheapest Usd Hr", "n": "cheapest_usd_hr", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "cheapest_usd_hr", "index$": 5 }, "degraded_providers": { "a": true, "h": "Degraded Providers", "n": "degraded_providers", "r": false, "t": "`$STRING`", "key$": "degraded_providers", "index$": 6 }, "fixing_date": { "a": true, "h": "Fixing Date", "n": "fixing_date", "r": false, "t": "`$STRING`", "key$": "fixing_date", "index$": 7 }, "floor_availability": { "a": true, "h": "Floor Availability", "n": "floor_availability", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "floor_availability", "index$": 8 }, "floor_billed_separately": { "a": true, "h": "Floor Billed Separately", "n": "floor_billed_separately", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "floor_billed_separately", "index$": 9 }, "floor_min_gpu_count": { "a": true, "h": "Floor Min Gpu Count", "n": "floor_min_gpu_count", "r": false, "t": ["`$ONE`", ["`$INTEGER`", "`$NULL`"]], "key$": "floor_min_gpu_count", "index$": 10 }, "floor_offer_type": { "a": true, "h": "Floor Offer Type", "n": "floor_offer_type", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "floor_offer_type", "index$": 11 }, "floor_provider": { "a": true, "h": "Floor Provider", "n": "floor_provider", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "floor_provider", "index$": 12 }, "floor_provider_label": { "a": true, "h": "Floor Provider Label", "n": "floor_provider_label", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "floor_provider_label", "index$": 13 }, "floor_usd_hr": { "a": true, "h": "Floor Usd Hr", "n": "floor_usd_hr", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "floor_usd_hr", "index$": 14 }, "gpu": { "a": true, "h": "Gpu", "n": "gpu", "r": false, "t": "`$STRING`", "key$": "gpu", "index$": 15 }, "gpu_model": { "a": true, "h": "Gpu Model", "n": "gpu_model", "r": false, "t": "`$STRING`", "key$": "gpu_model", "index$": 16 }, "gpu_slug": { "a": true, "h": "Gpu Slug", "n": "gpu_slug", "r": false, "t": "`$STRING`", "key$": "gpu_slug", "index$": 17 }, "hyperscaler_median_usd_hr": { "a": true, "h": "Hyperscaler Median Usd Hr", "n": "hyperscaler_median_usd_hr", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "hyperscaler_median_usd_hr", "index$": 18 }, "hyperscaler_providers": { "a": true, "h": "Hyperscaler Providers", "n": "hyperscaler_providers", "r": false, "t": "`$INTEGER`", "key$": "hyperscaler_providers", "index$": 19 }, "in_stock_offers": { "a": true, "h": "In Stock Offers", "n": "in_stock_offers", "r": false, "t": "`$INTEGER`", "key$": "in_stock_offers", "index$": 20 }, "method_version": { "a": true, "h": "Method Version", "n": "method_version", "r": false, "t": "`$STRING`", "key$": "method_version", "index$": 21 }, "offer_count": { "a": true, "h": "Offer Count", "n": "offer_count", "r": false, "t": "`$INTEGER`", "key$": "offer_count", "index$": 22 }, "on_demand_median_usd_hr": { "a": true, "h": "On Demand Median Usd Hr", "n": "on_demand_median_usd_hr", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "on_demand_median_usd_hr", "index$": 23 }, "on_demand_offers": { "a": true, "h": "On Demand Offers", "n": "on_demand_offers", "r": false, "t": "`$INTEGER`", "key$": "on_demand_offers", "index$": 24 }, "on_demand_providers": { "a": true, "h": "On Demand Providers", "n": "on_demand_providers", "r": false, "t": "`$INTEGER`", "key$": "on_demand_providers", "index$": 25 }, "page_url": { "a": true, "h": "Page Url", "n": "page_url", "r": false, "sh": "Absolute URL of this GPU's live price page, with every live offer.", "t": "`$STRING`", "key$": "page_url", "index$": 26 }, "provider_count": { "a": true, "h": "Provider Count", "n": "provider_count", "r": false, "t": "`$INTEGER`", "key$": "provider_count", "index$": 27 }, "slug": { "a": true, "h": "Slug", "n": "slug", "r": false, "t": "`$STRING`", "key$": "slug", "index$": 28 }, "snapshot_at": { "a": true, "h": "Snapshot At", "n": "snapshot_at", "r": false, "t": "`$STRING`", "key$": "snapshot_at", "index$": 29 }, "spot_floor_availability": { "a": true, "h": "Spot Floor Availability", "n": "spot_floor_availability", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "spot_floor_availability", "index$": 30 }, "spot_floor_billed_separately": { "a": true, "h": "Spot Floor Billed Separately", "n": "spot_floor_billed_separately", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "spot_floor_billed_separately", "index$": 31 }, "spot_floor_min_gpu_count": { "a": true, "h": "Spot Floor Min Gpu Count", "n": "spot_floor_min_gpu_count", "r": false, "t": ["`$ONE`", ["`$INTEGER`", "`$NULL`"]], "key$": "spot_floor_min_gpu_count", "index$": 32 }, "spot_floor_provider": { "a": true, "h": "Spot Floor Provider", "n": "spot_floor_provider", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "spot_floor_provider", "index$": 33 }, "spot_floor_provider_label": { "a": true, "h": "Spot Floor Provider Label", "n": "spot_floor_provider_label", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "spot_floor_provider_label", "index$": 34 }, "spot_floor_usd_hr": { "a": true, "h": "Spot Floor Usd Hr", "n": "spot_floor_usd_hr", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "spot_floor_usd_hr", "index$": 35 }, "spot_providers": { "a": true, "h": "Spot Providers", "n": "spot_providers", "r": false, "t": "`$INTEGER`", "key$": "spot_providers", "index$": 36 }, "stock_known_offers": { "a": true, "h": "Stock Known Offers", "n": "stock_known_offers", "r": false, "t": "`$INTEGER`", "key$": "stock_known_offers", "index$": 37 }, "tier": { "a": true, "h": "Tier", "n": "tier", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "tier", "index$": 38 }, "url": { "a": true, "h": "Url", "n": "url", "r": false, "sh": "Site-relative path of this GPU's live price page, e.g.", "t": "`$STRING`", "key$": "url", "index$": 39 }, "vendor": { "a": true, "h": "Vendor", "n": "vendor", "r": false, "t": ["`$ONE`", ["`$STRING`", "`$NULL`"]], "key$": "vendor", "index$": 40 }, "vram_gb": { "a": true, "h": "Vram Gb", "n": "vram_gb", "r": false, "t": ["`$ONE`", ["`$NUMBER`", "`$NULL`"]], "key$": "vram_gb", "index$": 41 } }, "name": "price", "op": { "list": { "input": "data", "name": "list", "points": [{ "a": true, "co": { "id": "GET /api/v1/fixings", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "ex": "latest", "k": "query", "n": "date", "or": "date", "r": false, "t": "`$STRING`", "index$": 0 }, { "a": true, "ex": "h100-sxm", "k": "query", "n": "gpu", "or": "gpu", "r": false, "t": "`$STRING`", "index$": 1 }, { "a": true, "k": "query", "n": "limit", "or": "limit", "r": false, "t": "`$INTEGER`", "index$": 2 }, { "a": true, "k": "query", "n": "offset", "or": "offset", "r": false, "t": "`$INTEGER`", "index$": 3 }] }, "k": "http", "m": "GET", "o": "/api/v1/fixings", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "v1" }, { "lit": "fixings" }], "t": { "req": "`reqdata`", "res": "`body.fixings`" }, "index$": 0 }, { "a": true, "co": { "id": "GET /api/v1/gpus", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "k": "query", "n": "tier", "or": "tier", "r": false, "t": "`$STRING`", "index$": 0 }, { "a": true, "k": "query", "n": "vendor", "or": "vendor", "r": false, "t": "`$STRING`", "index$": 1 }] }, "k": "http", "m": "GET", "o": "/api/v1/gpus", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "v1" }, { "lit": "gpus" }], "t": { "req": "`reqdata`", "res": "`body.gpus`" }, "index$": 1 }], "key$": "list" }, "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /api/v1/availability", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "ex": "30", "k": "query", "n": "day", "or": "days", "r": false, "t": "`$INTEGER`", "index$": 0 }, { "a": true, "ex": "b200", "k": "query", "n": "gpu", "or": "gpu", "r": false, "t": "`$STRING`", "index$": 1 }] }, "k": "http", "m": "GET", "o": "/api/v1/availability", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "v1" }, { "lit": "availability" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }, { "a": true, "co": { "id": "GET /api/v1/aws-capacity-blocks", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "ex": "h100-sxm", "k": "query", "n": "gpu", "or": "gpu", "r": false, "t": "`$STRING`", "index$": 0 }, { "a": true, "ex": "p5.48xlarge", "k": "query", "n": "instance_type", "or": "instance_type", "r": false, "t": "`$STRING`", "index$": 1 }] }, "k": "http", "m": "GET", "o": "/api/v1/aws-capacity-blocks", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "v1" }, { "lit": "aws-capacity-blocks" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 1 }, { "a": true, "co": { "id": "GET /api/v1/price-changes", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "ex": "h100-sxm", "k": "query", "n": "gpu", "or": "gpu", "r": false, "t": "`$STRING`", "index$": 0 }, { "a": true, "k": "query", "n": "limit", "or": "limit", "r": false, "t": "`$INTEGER`", "index$": 1 }, { "a": true, "k": "query", "n": "offset", "or": "offset", "r": false, "t": "`$INTEGER`", "index$": 2 }, { "a": true, "ex": "nebius", "k": "query", "n": "provider", "or": "provider", "r": false, "t": "`$STRING`", "index$": 3 }] }, "k": "http", "m": "GET", "o": "/api/v1/price-changes", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "v1" }, { "lit": "price-changes" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 2 }, { "a": true, "co": { "id": "GET /api/v1/price-risk", "source": "openapi3", "version": 2 }, "g": { "query": [{ "a": true, "ex": "h100-sxm", "k": "query", "n": "gpu", "or": "gpu", "r": false, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/api/v1/price-risk", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "api" }, { "lit": "v1" }, { "lit": "price-risk" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 3 }], "key$": "load" } }, "relations": { "ancestors": [] }, "key$": "price", "name__orig": "price", "Name": "Price", "name_": "price", "name-": "price", "NAME": "PRICE", "index$": 1 }, { "active": true, "entity": "price", "key$": "BasicPriceFlow", "kind": "basic", "name": "BasicPriceFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": {}, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemExists", "def": { "ref": "price_ref01" } }], "index$": 0 }, { "a": true, "d": {}, "i": { "ref": "price_ref01", "srcdatavar": "price_ref01_data", "suffix": "_dt0" }, "m": {}, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-price_ref01" } }], "index$": 1 }] }, 'Price', { "GET /api/v1/fixings": { "protocol": "http", "parameters": [{ "name": "date", "in": "query", "required": false, "description": "One fixing day as YYYY-MM-DD, or \"latest\" for the most recent one. Omit for the whole archive, newest day first.", "schema": { "type": "string" }, "example": "latest", "index$": 0 }, { "name": "gpu", "in": "query", "required": false, "description": "One GPU's fixing series, by slug (h100-sxm) or model name (H100 SXM).", "schema": { "type": "string" }, "example": "h100-sxm", "index$": 1 }, { "name": "limit", "in": "query", "required": false, "description": "Rows per page (default 100, at most 500).", "schema": { "type": "integer" }, "index$": 2 }, { "name": "offset", "in": "query", "required": false, "description": "Rows to skip, for paging (default 0). The response's next_offset is the value for the next page, or null on the last one.", "schema": { "type": "integer" }, "index$": 3 }] }, "GET /api/v1/gpus": { "protocol": "http", "parameters": [{ "name": "vendor", "in": "query", "required": false, "description": "Return only GPUs made by this vendor (case-insensitive). Combines with tier: both must match. Omit for every vendor.", "schema": { "type": "string", "enum": ["NVIDIA", "AMD"] }, "index$": 0 }, { "name": "tier", "in": "query", "required": false, "description": "Return only one class of GPU (case-insensitive; combines with vendor). flagship: the current top training and inference accelerators (H100, H200, B200, GB200, MI300X, MI355X). datacenter: earlier or mid-range data-center and workstation cards (A100, L40S, L4, A10, RTX 6000 Ada, V100, MI210). prosumer: desktop consumer and workstation cards (RTX 5090, RTX 4090, RTX 3090, RTX A4000). entry: small inference cards (T4, A2, A16, P4). Omit for every tier.", "schema": { "type": "string", "enum": ["flagship", "datacenter", "prosumer", "entry"] }, "index$": 1 }] }, "GET /api/v1/availability": { "protocol": "http", "parameters": [{ "name": "gpu", "in": "query", "required": false, "description": "One GPU's series, by slug (b200) or model name (B200).", "schema": { "type": "string" }, "example": "b200", "index$": 0 }, { "name": "days", "in": "query", "required": false, "description": "Completed days to return, newest first (default 30, at most 120).", "schema": { "type": "integer" }, "example": "30", "index$": 1 }] }, "GET /api/v1/aws-capacity-blocks": { "protocol": "http", "parameters": [{ "name": "gpu", "in": "query", "required": false, "description": "One GPU, by its /gpus slug (h100-sxm, h200, b200).", "schema": { "type": "string" }, "example": "h100-sxm", "index$": 0 }, { "name": "instance_type", "in": "query", "required": false, "description": "One EC2 instance type.", "schema": { "type": "string" }, "example": "p5.48xlarge", "index$": 1 }] }, "GET /api/v1/price-changes": { "protocol": "http", "parameters": [{ "name": "provider", "in": "query", "required": false, "description": "One provider, by slug (nebius, runpod, aws).", "schema": { "type": "string" }, "example": "nebius", "index$": 0 }, { "name": "gpu", "in": "query", "required": false, "description": "One GPU, by its /gpus slug (h100-sxm).", "schema": { "type": "string" }, "example": "h100-sxm", "index$": 1 }, { "name": "limit", "in": "query", "required": false, "description": "Entries per page (default 50, at most 200).", "schema": { "type": "integer" }, "index$": 2 }, { "name": "offset", "in": "query", "required": false, "description": "Entries to skip, for paging (default 0).", "schema": { "type": "integer" }, "index$": 3 }] }, "GET /api/v1/price-risk": { "protocol": "http", "parameters": [{ "name": "gpu", "in": "query", "required": false, "description": "One GPU, by slug; adds every daily floor, daily change and provider price behind its figures.", "schema": { "type": "string" }, "example": "h100-sxm", "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let price_ref01_data = Object.values(setup.data.existing.price)[0];
        // LIST
        const price_ref01_ent = client.Price();
        const price_ref01_match = {};
        const price_ref01_list = (await price_ref01_ent.list(price_ref01_match)).map((e) => e.data());
        // LOAD
        const price_ref01_match_dt0 = {};
        const price_ref01_data_dt0 = (await price_ref01_ent.load(price_ref01_match_dt0)).data();
        (0, node_assert_1.default)(null != price_ref01_data_dt0);
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
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/price/PriceTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.FastgpuSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['price01', 'price02', 'price03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'FASTGPU_TEST_PRICE_ENTID': idmap,
        'FASTGPU_TEST_LIVE': 'FALSE',
        'FASTGPU_TEST_EXPLAIN': 'FALSE',
        'FASTGPU_APIKEY': '',
    });
    idmap = env['FASTGPU_TEST_PRICE_ENTID'];
    const live = 'TRUE' === env.FASTGPU_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['FASTGPU_TEST_PRICE_ENTID'];
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
//# sourceMappingURL=PriceEntity.test.js.map