# Fastgpu Lua SDK



The Lua SDK for the Fastgpu API — an entity-oriented client using Lua conventions.

It exposes the API as capitalised, semantic **Entities** — e.g. `client:Match()` — each with the same small set of operations (`list`, `load`, `create`, `remove`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to LuaRocks. Install it from the
GitHub release tag (`lua/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/fastgpu-sdk/tags)),
or add the source directory to your `LUA_PATH`:

```bash
export LUA_PATH="path/to/lua/?.lua;path/to/lua/?/init.lua;;"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```lua
local sdk = require("fastgpu_sdk")

local client = sdk.new({
  apikey = os.getenv("FASTGPU_APIKEY"),
})
```

### 2. List match records

Entity operations return `(value, err)`. For `list`, `value` is an
array of entities, one per record — iterate it directly (there is no
wrapper), and read each record with `data_get()`.

```lua
local matchs, err = client:Match():list({ query = "example" })
if err then error(err) end

for _, item in ipairs(matchs) do
  for k, val in pairs(item:data_get()) do print(k, val) end
end
```


## Error handling

Entity operations return `(value, err)`. Check `err` before using
the value:

```lua
local matchs, err = client:Match():list({ query = "example" })
if err then error(err) end
```

`direct` follows the same `(value, err)` convention:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example_id" },
})
if err then error(err) end
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
if err then error(err) end

if result["ok"] then
  print(result["status"])  -- 200
  print(result["data"])    -- response body
end
```

### Prepare a request without sending it

```lua
local fetchdef, err = client:prepare({
  path = "/api/resource/{id}",
  method = "DELETE",
  params = { id = "example" },
})
if err then error(err) end

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```lua
local client = sdk.test()

local result, err = client:Match():list({ query = "example" })
-- result is an array of entities, one per mock record; err is set on failure
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```lua
local function mock_fetch(url, init)
  return {
    status = 200,
    statusText = "OK",
    headers = {},
    json = function()
      return { id = "mock01" }
    end,
  }, nil
end

local client = sdk.new({
  base = "http://localhost:8080",
  system = {
    fetch = mock_fetch,
  },
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
FASTGPU_TEST_LIVE=TRUE
FASTGPU_APIKEY=<your-key>
```

Then run:

```bash
cd lua && busted test/
```


## Reference

### FastgpuSDK

```lua
local sdk = require("fastgpu_sdk")
local client = sdk.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `table` | Feature activation flags. |
| `extend` | `table` | Additional Feature instances to load. |
| `system` | `table` | System overrides (e.g. custom `fetch` function). |

### test

```lua
local client = sdk.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### FastgpuSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> table` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> table, err` | Build an HTTP request definition without sending. |
| `direct` | `(fetchargs) -> table, err` | Build and send an HTTP request. |
| `Match` | `(data) -> MatchEntity` | Create a Match entity instance. |
| `Price` | `(data) -> PriceEntity` | Create a Price entity instance. |
| `Router` | `(data) -> RouterEntity` | Create a Router entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any, err` | Load a single entity by match criteria, and return it. |
| `list` | `(reqmatch, ctrl) -> any, err` | List entities matching the criteria, one per record. |
| `create` | `(reqdata, ctrl) -> any, err` | Create a new entity, and return it. |
| `remove` | `(reqmatch, ctrl) -> any, err` | Remove an entity, and return it marked as deleted. |
| `data_get` | `() -> table` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> table` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> string` | Return the entity name. |

### Result shape

Entity operations return `(value, err)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `load` / `create` / `remove` | the entity, whose `data_get()` reads its record (a `table`) |
| `list` | an array (`table`) of entities, one per record |

Check `err` first (it is non-`nil` on failure), then use `value`:

    local price, err = client:Price():load()
    if err then error(err) end
    -- price is the loaded entity

Only `direct()` returns a response envelope — a `table` with `ok`,
`status`, `headers`, and `data` keys.

### Entities

#### Match

| Field | Description |
| --- | --- |
| `billed_hours` | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` |  |
| `estimated_total_usd` | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` |  |
| `gpu` |  |
| `gpu_count` |  |
| `monthly_usd` |  |
| `offer_type` |  |
| `over_budget` |  |
| `page_url` | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` |  |
| `provider` |  |
| `provider_label` |  |
| `quote_age_seconds` | Seconds between fetched_at and as_of. |
| `reason` |  |
| `reliability` |  |
| `score` |  |
| `tokens_per_sec` |  |
| `url` | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` |  |

Operations: List.

API path: `/api/v1/match`

#### Price

| Field | Description |
| --- | --- |
| `arch` |  |
| `carried_providers` |  |
| `cheapest_billed_separately` |  |
| `cheapest_min_gpu_count` |  |
| `cheapest_provider` |  |
| `cheapest_usd_hr` |  |
| `degraded_providers` |  |
| `fixing_date` |  |
| `floor_availability` |  |
| `floor_billed_separately` |  |
| `floor_min_gpu_count` |  |
| `floor_offer_type` |  |
| `floor_provider` |  |
| `floor_provider_label` |  |
| `floor_usd_hr` |  |
| `gpu` |  |
| `gpu_model` |  |
| `gpu_slug` |  |
| `hyperscaler_median_usd_hr` |  |
| `hyperscaler_providers` |  |
| `in_stock_offers` |  |
| `method_version` |  |
| `offer_count` |  |
| `on_demand_median_usd_hr` |  |
| `on_demand_offers` |  |
| `on_demand_providers` |  |
| `page_url` | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` |  |
| `slug` |  |
| `snapshot_at` |  |
| `spot_floor_availability` |  |
| `spot_floor_billed_separately` |  |
| `spot_floor_min_gpu_count` |  |
| `spot_floor_provider` |  |
| `spot_floor_provider_label` |  |
| `spot_floor_usd_hr` |  |
| `spot_providers` |  |
| `stock_known_offers` |  |
| `tier` |  |
| `url` | Site-relative path of this GPU's live price page, e.g. |
| `vendor` |  |
| `vram_gb` |  |

Operations: List, Load.

API path: `/api/v1/fixings`

#### Router

| Field | Description |
| --- | --- |
| `id` |  |

Operations: Create, Remove.

API path: `/api/v1/router/launch`



## Entities


### Match

Create an instance: `local match = client:Match(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `billed_hours` | `number|nil` | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `string` | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `number` |  |
| `estimated_total_usd` | `number|nil` | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `string|nil` | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `boolean` |  |
| `gpu` | `string` |  |
| `gpu_count` | `number` |  |
| `monthly_usd` | `number` |  |
| `offer_type` | `string` |  |
| `over_budget` | `boolean` |  |
| `page_url` | `string` | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `boolean` |  |
| `provider` | `string` |  |
| `provider_label` | `string|nil` |  |
| `quote_age_seconds` | `number|nil` | Seconds between fetched_at and as_of. |
| `reason` | `string` |  |
| `reliability` | `string` |  |
| `score` | `number|nil` |  |
| `tokens_per_sec` | `number|nil` |  |
| `url` | `string` | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `number|nil` |  |

#### Example: List

```lua
local matchs, err = client:Match():list({ query = "example" })
```


### Price

Create an instance: `local price = client:Price(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `arch` | `string|nil` |  |
| `carried_providers` | `number` |  |
| `cheapest_billed_separately` | `string|nil` |  |
| `cheapest_min_gpu_count` | `number|nil` |  |
| `cheapest_provider` | `string|nil` |  |
| `cheapest_usd_hr` | `number|nil` |  |
| `degraded_providers` | `string` |  |
| `fixing_date` | `string` |  |
| `floor_availability` | `string|nil` |  |
| `floor_billed_separately` | `string|nil` |  |
| `floor_min_gpu_count` | `number|nil` |  |
| `floor_offer_type` | `string|nil` |  |
| `floor_provider` | `string|nil` |  |
| `floor_provider_label` | `string|nil` |  |
| `floor_usd_hr` | `number|nil` |  |
| `gpu` | `string` |  |
| `gpu_model` | `string` |  |
| `gpu_slug` | `string` |  |
| `hyperscaler_median_usd_hr` | `number|nil` |  |
| `hyperscaler_providers` | `number` |  |
| `in_stock_offers` | `number` |  |
| `method_version` | `string` |  |
| `offer_count` | `number` |  |
| `on_demand_median_usd_hr` | `number|nil` |  |
| `on_demand_offers` | `number` |  |
| `on_demand_providers` | `number` |  |
| `page_url` | `string` | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `number` |  |
| `slug` | `string` |  |
| `snapshot_at` | `string` |  |
| `spot_floor_availability` | `string|nil` |  |
| `spot_floor_billed_separately` | `string|nil` |  |
| `spot_floor_min_gpu_count` | `number|nil` |  |
| `spot_floor_provider` | `string|nil` |  |
| `spot_floor_provider_label` | `string|nil` |  |
| `spot_floor_usd_hr` | `number|nil` |  |
| `spot_providers` | `number` |  |
| `stock_known_offers` | `number` |  |
| `tier` | `string|nil` |  |
| `url` | `string` | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `string|nil` |  |
| `vram_gb` | `number|nil` |  |

#### Example: Load

```lua
local price, err = client:Price():load()
```

#### Example: List

```lua
local prices, err = client:Price():list()
```


### Router

Create an instance: `local router = client:Router(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `remove(match)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |

#### Example: Create

```lua
local router, err = client:Router():create({
})
```

## Features

This SDK ships 4 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`ratelimit`](#ratelimit) | Rate limiting |
| [`retry`](#retry) | Retry |
| [`test`](#test) | Test transport |
| [`timeout`](#timeout) | Timeout |

> **Order matters for `ratelimit`, `retry`, `timeout`.** These wrap the
> transport, so each one wraps whatever is already installed: the order you
> activate them in IS the nesting order. Activating them as an ordered list
> rather than a map is what fixes that order.

### ratelimit

Rate limiting.

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

Set `feature.ratelimit.active` to enable it, then override any of the options above.

`ratelimit` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### retry

Retry.

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

Set `feature.retry.active` to enable it, then override any of the options above.

`retry` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.

### timeout

Timeout.

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

Set `feature.timeout.active` to enable it, then override any of the options above.

`timeout` wraps the transport, so its position among the other
transport features decides what it sees. A feature activated later wraps one
activated earlier.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is a Lua table
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as tables

The Lua SDK uses plain Lua tables throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a table.

### Module structure

```
lua/
├── fastgpu_sdk.lua    -- Main SDK module
├── config.lua               -- Configuration
├── schema.lua               -- Generated option + entity specs
├── features.lua             -- Feature factory
├── core/                    -- Core types and context
├── entity/                  -- Entity implementations
├── feature/                 -- Built-in features (Base, Test, Log)
├── utility/                 -- Utility functions and struct library
└── test/                    -- Test suites
```

The main module (`fastgpu_sdk`) exports the SDK constructor
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```lua
local match = client:Match()
match:list({ query = "example" })

-- match:data_get() now returns the match data from the last list
-- match:match_get() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
