# Fastgpu Lua SDK Reference

Complete API reference for the Fastgpu Lua SDK.


## FastgpuSDK

### Constructor

```lua
local sdk = require("fastgpu_sdk")
local client = sdk.new(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `table` | SDK configuration options. |
| `options.apikey` | `string` | API key for authentication. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `table` | Custom headers for all requests. |
| `options.feature` | `table` | Feature configuration. |
| `options.system` | `table` | System overrides (e.g. custom fetch). |


### Static Methods

#### `sdk.test(testopts?, sdkopts?)`

Create a test client with mock features active. Both arguments are optional.

```lua
local client = sdk.test()
```


### Instance Methods

#### `Match(data)`

Create a new `Match` entity instance. Pass `nil` for no initial data.

#### `Price(data)`

Create a new `Price` entity instance. Pass `nil` for no initial data.

#### `Router(data)`

Create a new `Router` entity instance. Pass `nil` for no initial data.

#### `options_map() -> table`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs) -> table, err`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `"GET"`). |
| `fetchargs.params` | `table` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `table` | Query string parameters. |
| `fetchargs.headers` | `table` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (tables are JSON-serialized). |
| `fetchargs.ctrl` | `table` | Control options (e.g. `{ explain = true }`). |

**Returns:** `table, err`

#### `prepare(fetchargs) -> table, err`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `table, err`


---

## MatchEntity

```lua
local match = client:Match(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `billed_hours` | `number|nil` | No | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `string` | No | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `number` | No |  |
| `estimated_total_usd` | `number|nil` | No | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `string|nil` | No | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `boolean` | No |  |
| `gpu` | `string` | No |  |
| `gpu_count` | `number` | No |  |
| `monthly_usd` | `number` | No |  |
| `offer_type` | `string` | No |  |
| `over_budget` | `boolean` | No |  |
| `page_url` | `string` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `boolean` | No |  |
| `provider` | `string` | No |  |
| `provider_label` | `string|nil` | No |  |
| `quote_age_seconds` | `number|nil` | No | Seconds between fetched_at and as_of. |
| `reason` | `string` | No |  |
| `reliability` | `string` | No |  |
| `score` | `number|nil` | No |  |
| `tokens_per_sec` | `number|nil` | No |  |
| `url` | `string` | No | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `number|nil` | No |  |

### Operations

#### `list(reqmatch, ctrl) -> any, err`

List entities matching the given criteria. Returns an array of entities, one per record, or `nil` and an error on failure.

```lua
local results, err = client:Match():list({ query = "example" })
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `MatchEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## PriceEntity

```lua
local price = client:Price(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `arch` | `string|nil` | No |  |
| `carried_providers` | `number` | No |  |
| `cheapest_billed_separately` | `string|nil` | No |  |
| `cheapest_min_gpu_count` | `number|nil` | No |  |
| `cheapest_provider` | `string|nil` | No |  |
| `cheapest_usd_hr` | `number|nil` | No |  |
| `degraded_providers` | `string` | No |  |
| `fixing_date` | `string` | No |  |
| `floor_availability` | `string|nil` | No |  |
| `floor_billed_separately` | `string|nil` | No |  |
| `floor_min_gpu_count` | `number|nil` | No |  |
| `floor_offer_type` | `string|nil` | No |  |
| `floor_provider` | `string|nil` | No |  |
| `floor_provider_label` | `string|nil` | No |  |
| `floor_usd_hr` | `number|nil` | No |  |
| `gpu` | `string` | No |  |
| `gpu_model` | `string` | No |  |
| `gpu_slug` | `string` | No |  |
| `hyperscaler_median_usd_hr` | `number|nil` | No |  |
| `hyperscaler_providers` | `number` | No |  |
| `in_stock_offers` | `number` | No |  |
| `method_version` | `string` | No |  |
| `offer_count` | `number` | No |  |
| `on_demand_median_usd_hr` | `number|nil` | No |  |
| `on_demand_offers` | `number` | No |  |
| `on_demand_providers` | `number` | No |  |
| `page_url` | `string` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `number` | No |  |
| `slug` | `string` | No |  |
| `snapshot_at` | `string` | No |  |
| `spot_floor_availability` | `string|nil` | No |  |
| `spot_floor_billed_separately` | `string|nil` | No |  |
| `spot_floor_min_gpu_count` | `number|nil` | No |  |
| `spot_floor_provider` | `string|nil` | No |  |
| `spot_floor_provider_label` | `string|nil` | No |  |
| `spot_floor_usd_hr` | `number|nil` | No |  |
| `spot_providers` | `number` | No |  |
| `stock_known_offers` | `number` | No |  |
| `tier` | `string|nil` | No |  |
| `url` | `string` | No | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `string|nil` | No |  |
| `vram_gb` | `number|nil` | No |  |

### Operations

#### `list(reqmatch, ctrl) -> any, err`

List entities matching the given criteria. Returns an array of entities, one per record, or `nil` and an error on failure.

```lua
local results, err = client:Price():list()
```

#### `load(reqmatch, ctrl) -> any, err`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, or `nil` and an error on failure.

```lua
local result, err = client:Price():load()
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `PriceEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## RouterEntity

```lua
local router = client:Router(nil)
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No |  |

### Operations

#### `create(reqdata, ctrl) -> any, err`

Create a new entity with the given data. Returns the created entity, or `nil` and an error on failure.

```lua
local result, err = client:Router():create({
})
```

#### `remove(reqmatch, ctrl) -> any, err`

Remove the entity matching the given criteria. Returns the entity, marked as deleted, or `nil` and an error on failure.

```lua
local result, err = client:Router():remove({ id = "router_id" })
```

### Common Methods

#### `data_get() -> table`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> table`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `RouterEntity` instance with the same client and
options.

#### `get_name() -> string`

Return the entity name.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `ratelimit` | 0.0.1 | Rate limiting |
| `retry` | 0.0.1 | Retry |
| `test` | 0.0.1 | Test transport |
| `timeout` | 0.0.1 | Timeout |


Features are activated via the `feature` option:

```lua
local client = sdk.new({
  feature = {
    ratelimit = { active = true },
    retry = { active = true },
    test = { active = true },
    timeout = { active = true },
  },
})
```


### Configuring features

Each feature is inactive until switched on, and an SDK with no feature
configured does no feature work at all. Every option below keeps its default
unless you name it.

The array form of \`feature\` is significant: several features wrap the
transport, and the order you list them in is the order they nest.

#### Ordering

`ratelimit`, `retry`, `timeout` wrap the transport. Each
wraps whatever is already installed, so **activation order is nesting order**:
a feature activated later sits OUTSIDE one activated earlier, and sees the call
first.

That decides behaviour, not just sequence: a feature that short-circuits the
call, such as a cache serving a hit, stops every feature nested inside it from
ever seeing that call.

`test` attach to pipeline hooks
rather than the transport, so their order does not affect what they observe.

#### `ratelimit`

Rate limiting.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `burst` | `5` |
| `rate` | `5` |

| Option | Type |
|---|---|
| `now` | function |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.ratelimit.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `retry`

Retry.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `factor` | `2` |
| `maxDelay` | `2000` |
| `minDelay` | `50` |
| `retries` | `2` |
| `statuses` | `[408, 425, 429, 500, 502, 503, 504]` |

| Option | Type |
|---|---|
| `jitter` | boolean |
| `sleep` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.retry.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

#### `test`

Test transport.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |

| Option | Type |
|---|---|
| `entity` | map |
| `net` | map |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.test.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Attaches to pipeline hooks, not the transport, so activation order does
  not change what it observes.
- Installs the BASE transport that the wrapping features wrap, so it must be
  activated before them.
- Inactive by default: leaving it out costs nothing at runtime.

#### `timeout`

Timeout.

**Configuration**

| Option | Default |
|---|---|
| `active` | `false` |
| `ms` | `30000` |

| Option | Type |
|---|---|
| `clearTimer` | function |
| `now` | function |
| `setTimer` | function |

These take no default: the feature behaves one way when you supply them and
another when you do not.

**Usage**

Set `feature.timeout.active` to true in the client options, and override any option above in the same entry. Every option keeps
its default unless you name it.

**Considerations**

- Wraps the transport: its place in the activation order decides what it
  sees. See [Ordering](#ordering) above.
- Inactive by default: leaving it out costs nothing at runtime.

