"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "match",
        "accessor": "Match",
        "op": "list",
        "method": "GET",
        "path": "/api/v1/match",
        "args": [],
        "select": {
            "query": "cheapest to serve Llama 3 70B",
            "budget_usd_hr": "v1",
            "duration_hour": "v1",
            "gpu_count": "v1",
            "max_quote_age_minute": "v1",
            "max_total_usd": "v1",
            "min_gpu_memory_gb": "v1",
            "model": "v1",
            "params_b": "v1",
            "precision": "v1",
            "region": "v1",
            "reserved": "v1",
            "spot": "v1",
            "task": "v1",
            "vram_gb": "v1",
            "weights_gb": "v1"
        },
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [
            "query",
            "model",
            "params_b",
            "weights_gb",
            "vram_gb",
            "task",
            "precision",
            "gpu_count",
            "min_gpu_memory_gb",
            "budget_usd_hr",
            "duration_hours",
            "max_total_usd",
            "max_quote_age_minutes",
            "region",
            "spot",
            "reserved"
        ],
        "queryArgs": [
            {
                "name": "budget_usd_hr",
                "wire": "budget_usd_hr"
            },
            {
                "name": "duration_hour",
                "wire": "duration_hours"
            },
            {
                "name": "gpu_count",
                "wire": "gpu_count"
            },
            {
                "name": "max_quote_age_minute",
                "wire": "max_quote_age_minutes"
            },
            {
                "name": "max_total_usd",
                "wire": "max_total_usd"
            },
            {
                "name": "min_gpu_memory_gb",
                "wire": "min_gpu_memory_gb"
            },
            {
                "name": "model",
                "wire": "model"
            },
            {
                "name": "params_b",
                "wire": "params_b"
            },
            {
                "name": "precision",
                "wire": "precision"
            },
            {
                "name": "query",
                "wire": "query"
            },
            {
                "name": "region",
                "wire": "region"
            },
            {
                "name": "reserved",
                "wire": "reserved"
            },
            {
                "name": "spot",
                "wire": "spot"
            },
            {
                "name": "task",
                "wire": "task"
            },
            {
                "name": "vram_gb",
                "wire": "vram_gb"
            },
            {
                "name": "weights_gb",
                "wire": "weights_gb"
            }
        ],
        "auth": [],
        "status": 200,
        "sample": {
            "updated_at": "x",
            "stale": true,
            "workload": {
                "interpretation": "x",
                "identified": true,
                "task": "x",
                "precision": "x",
                "vram_required_gb": 1,
                "gpu_count": 1,
                "min_gpu_memory_gb": 1,
                "gpu_vendors": [
                    "x"
                ]
            },
            "hero": {
                "hyperscaler_ceiling": "x",
                "savings_pct": 1,
                "same_model": true
            },
            "count": 1,
            "matches": [
                {
                    "gpu": "x",
                    "gpu_count": 1,
                    "effective_usd_hr": 1,
                    "monthly_usd": 1,
                    "provider": "x",
                    "provider_label": "x",
                    "offer_type": "x",
                    "reliability": "x",
                    "fits_single_card": true,
                    "over_budget": true,
                    "tokens_per_sec": 1,
                    "usd_per_million_tokens": 1,
                    "score": 1,
                    "partner": true,
                    "reason": "x",
                    "billing_increment": "per-second",
                    "billed_hours": 1,
                    "estimated_total_usd": 1,
                    "fetched_at": "x",
                    "quote_age_seconds": 1,
                    "url": "x",
                    "page_url": "x"
                }
            ],
            "as_of": "x",
            "limits": {
                "budget_usd_hr": 1,
                "duration_hours": 1,
                "max_total_usd": 1,
                "max_quote_age_minutes": 1,
                "excluded": {
                    "over_budget_usd_hr": 1,
                    "over_max_total_usd": 1,
                    "older_than_max_quote_age_minutes": 1
                },
                "nearest_excluded": {
                    "gpu": "x",
                    "gpu_count": 1,
                    "effective_usd_hr": 1,
                    "monthly_usd": 1,
                    "provider": "x",
                    "provider_label": "x",
                    "offer_type": "x",
                    "reliability": "x",
                    "fits_single_card": true,
                    "over_budget": true,
                    "tokens_per_sec": 1,
                    "usd_per_million_tokens": 1,
                    "score": 1,
                    "partner": true,
                    "reason": "x",
                    "billing_increment": "per-second",
                    "billed_hours": 1,
                    "estimated_total_usd": 1,
                    "fetched_at": "x",
                    "quote_age_seconds": 1,
                    "url": "x",
                    "page_url": "x",
                    "breaks": [
                        "x"
                    ]
                }
            },
            "note": "x",
            "error": "x"
        },
        "idField": "id"
    },
    {
        "entity": "router",
        "accessor": "Router",
        "op": "create",
        "method": "POST",
        "path": "/api/v1/router/launch",
        "action": "launch",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "instance": {
                "id": "x",
                "status": "x",
                "provider": "x",
                "provider_label": "x",
                "gpu_model": "x",
                "gpu_count": 1,
                "price_usd_hr": 1,
                "provider_price_usd_hr": 1,
                "connection": {
                    "jupyterUrl": "x",
                    "sshHost": "x",
                    "sshPort": 1,
                    "publicIp": "x",
                    "note": "x"
                },
                "error": "x",
                "job_query": "x",
                "charged_usd": 1,
                "started_at": "x",
                "created_at": "x"
            }
        },
        "idField": "id"
    },
    {
        "entity": "router",
        "accessor": "Router",
        "op": "remove",
        "method": "DELETE",
        "path": "/api/v1/router/instances/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "authorization",
                    "scheme": "bearer"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "instance": {
                "id": "x",
                "status": "x",
                "provider": "x",
                "provider_label": "x",
                "gpu_model": "x",
                "gpu_count": 1,
                "price_usd_hr": 1,
                "provider_price_usd_hr": 1,
                "connection": {
                    "jupyterUrl": "x",
                    "sshHost": "x",
                    "sshPort": 1,
                    "publicIp": "x",
                    "note": "x"
                },
                "error": "x",
                "job_query": "x",
                "charged_usd": 1,
                "started_at": "x",
                "created_at": "x"
            }
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map