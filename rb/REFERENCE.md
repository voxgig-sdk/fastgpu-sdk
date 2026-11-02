# Fastgpu Ruby SDK Reference

Complete API reference for the Fastgpu Ruby SDK.


## FastgpuSDK

### Constructor

```ruby
require_relative 'Fastgpu_sdk'

client = FastgpuSDK.new(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `Hash` | SDK configuration options. |
| `options["apikey"]` | `String` | API key for authentication. |
| `options["base"]` | `String` | Base URL for API requests. |
| `options["prefix"]` | `String` | URL prefix appended after base. |
| `options["suffix"]` | `String` | URL suffix appended after path. |
| `options["headers"]` | `Hash` | Custom headers for all requests. |
| `options["feature"]` | `Hash` | Feature configuration. |
| `options["system"]` | `Hash` | System overrides (e.g. custom fetch). |


### Static Methods

#### `FastgpuSDK.test(testopts = nil, sdkopts = nil)`

Create a test client with mock features active. Both arguments may be `nil`.

```ruby
client = FastgpuSDK.test
```


### Instance Methods

#### `Match(data = nil)`

Create a new `Match` entity instance. Pass `nil` for no initial data.

#### `Price(data = nil)`

Create a new `Price` entity instance. Pass `nil` for no initial data.

#### `Router(data = nil)`

Create a new `Router` entity instance. Pass `nil` for no initial data.

#### `options_map -> Hash`

Return a deep copy of the current SDK options.

#### `get_utility -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs = {}) -> Hash`

Make a direct HTTP request to any API endpoint. Returns a result hash
(`{ "ok" => ..., "status" => ..., "data" => ..., "err" => ... }`); it
does not raise — inspect `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `String` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `String` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `Hash` | Path parameter values for `{param}` substitution. |
| `fetchargs["query"]` | `Hash` | Query string parameters. |
| `fetchargs["headers"]` | `Hash` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (hashes are JSON-serialized). |
| `fetchargs["ctrl"]` | `Hash` | Control options (e.g. `{ "explain" => true }`). |

**Returns:** `Hash`

#### `prepare(fetchargs = {}) -> Hash`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`. Raises on error.

**Returns:** `Hash` (the fetch definition; raises on error)


---

## MatchEntity

```ruby
match = client.Match
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `billed_hours` | `Object` | No | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `String` | No | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `Float` | No |  |
| `estimated_total_usd` | `Object` | No | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `Object` | No | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `Boolean` | No |  |
| `gpu` | `String` | No |  |
| `gpu_count` | `Integer` | No |  |
| `monthly_usd` | `Float` | No |  |
| `offer_type` | `String` | No |  |
| `over_budget` | `Boolean` | No |  |
| `page_url` | `String` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `Boolean` | No |  |
| `provider` | `String` | No |  |
| `provider_label` | `Object` | No |  |
| `quote_age_seconds` | `Object` | No | Seconds between fetched_at and as_of. |
| `reason` | `String` | No |  |
| `reliability` | `String` | No |  |
| `score` | `Object` | No |  |
| `tokens_per_sec` | `Object` | No |  |
| `url` | `String` | No | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `Object` | No |  |

### Operations

#### `list(reqmatch = nil, ctrl = nil) -> Array`

List entities matching the given criteria (call with no argument to list all). Returns an array of entities, one per record; `data_get` reads each record. Raises on error.

```ruby
results = client.Match.list({ "query" => "example" })
results.each { |item| puts item.data_get }
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `MatchEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## PriceEntity

```ruby
price = client.Price
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `arch` | `Object` | No |  |
| `carried_providers` | `Integer` | No |  |
| `cheapest_billed_separately` | `Object` | No |  |
| `cheapest_min_gpu_count` | `Object` | No |  |
| `cheapest_provider` | `Object` | No |  |
| `cheapest_usd_hr` | `Object` | No |  |
| `degraded_providers` | `String` | No |  |
| `fixing_date` | `String` | No |  |
| `floor_availability` | `Object` | No |  |
| `floor_billed_separately` | `Object` | No |  |
| `floor_min_gpu_count` | `Object` | No |  |
| `floor_offer_type` | `Object` | No |  |
| `floor_provider` | `Object` | No |  |
| `floor_provider_label` | `Object` | No |  |
| `floor_usd_hr` | `Object` | No |  |
| `gpu` | `String` | No |  |
| `gpu_model` | `String` | No |  |
| `gpu_slug` | `String` | No |  |
| `hyperscaler_median_usd_hr` | `Object` | No |  |
| `hyperscaler_providers` | `Integer` | No |  |
| `in_stock_offers` | `Integer` | No |  |
| `method_version` | `String` | No |  |
| `offer_count` | `Integer` | No |  |
| `on_demand_median_usd_hr` | `Object` | No |  |
| `on_demand_offers` | `Integer` | No |  |
| `on_demand_providers` | `Integer` | No |  |
| `page_url` | `String` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `Integer` | No |  |
| `slug` | `String` | No |  |
| `snapshot_at` | `String` | No |  |
| `spot_floor_availability` | `Object` | No |  |
| `spot_floor_billed_separately` | `Object` | No |  |
| `spot_floor_min_gpu_count` | `Object` | No |  |
| `spot_floor_provider` | `Object` | No |  |
| `spot_floor_provider_label` | `Object` | No |  |
| `spot_floor_usd_hr` | `Object` | No |  |
| `spot_providers` | `Integer` | No |  |
| `stock_known_offers` | `Integer` | No |  |
| `tier` | `Object` | No |  |
| `url` | `String` | No | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `Object` | No |  |
| `vram_gb` | `Object` | No |  |

### Operations

#### `list(reqmatch = nil, ctrl = nil) -> Array`

List entities matching the given criteria (call with no argument to list all). Returns an array of entities, one per record; `data_get` reads each record. Raises on error.

```ruby
results = client.Price.list
results.each { |item| puts item.data_get }
```

#### `load(reqmatch, ctrl = nil) -> result`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get` reads, and raises on error.

```ruby
result = client.Price.load()
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `PriceEntity` instance with the same client and
options.

#### `get_name -> String`

Return the entity name.


---

## RouterEntity

```ruby
router = client.Router
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `String` | No |  |

### Operations

#### `create(reqdata, ctrl = nil) -> result`

Create a new entity with the given data. Returns the created entity and raises on error.

```ruby
result = client.Router.create({
})
```

#### `remove(reqmatch, ctrl = nil) -> result`

Remove the entity matching the given criteria. Returns the entity, marked as deleted, and raises on error.

```ruby
result = client.Router.remove({ "id" => "router_id" })
```

### Common Methods

#### `data_get -> Hash`

Get the entity data. Returns a copy of the current data.

#### `data_set(data)`

Set the entity data.

#### `match_get -> Hash`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make -> Entity`

Create a new `RouterEntity` instance with the same client and
options.

#### `get_name -> String`

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

```ruby
client = FastgpuSDK.new({
  "feature" => {
    "ratelimit" => { "active" => true },
    "retry" => { "active" => true },
    "test" => { "active" => true },
    "timeout" => { "active" => true },
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

