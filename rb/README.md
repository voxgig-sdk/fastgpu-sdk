# Fastgpu Ruby SDK



The Ruby SDK for the Fastgpu API — an entity-oriented client using idiomatic Ruby conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.Match` — with named operations (`list`/`load`/`create`/`remove`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to RubyGems. Install it from the
GitHub release tag (`rb/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/fastgpu-sdk/tags)), or
from a clone:

```bash
git clone https://github.com/voxgig-sdk/fastgpu-sdk
```

Then add it to your `Gemfile` by path, and run `bundle install`:

```ruby
gem "voxgig-sdk-fastgpu-sdk", path: "./fastgpu-sdk/rb"
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ruby
require_relative "Fastgpu_sdk"

client = FastgpuSDK.new({
  "apikey" => ENV["FASTGPU_APIKEY"],
})
```

### 2. List match records

```ruby
begin
  # list returns an Array of Match entities, one per record; data_get reads the record.
  matchs = client.Match.list({ "query" => "example" })
  matchs.each do |item|
    record = item.data_get
    puts "#{record["billed_hours"]}"
  end
rescue => err
  warn "list failed: #{err}"
end
```


## Error handling

Entity operations raise on failure, so rescue them:

```ruby
begin
  matchs = client.Match.list({ "query" => "example" })
rescue => err
  warn "list failed: #{err}"
end
```

`direct` does **not** raise — it returns the result hash. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example_id" },
})

warn "request failed: #{result["err"] || "HTTP #{result["status"]}"}" unless result["ok"]
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ruby
result = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})

if result["ok"]
  puts result["status"]  # 200
  puts result["data"]    # response body
else
  # On an HTTP error status there is no err (only a transport failure sets
  # it), so fall back to the status code.
  warn(result["err"] || "HTTP #{result["status"]}")
end
```

### Prepare a request without sending it

```ruby
begin
  fetchdef = client.prepare({
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => { "id" => "example" },
  })
  puts fetchdef["url"]
  puts fetchdef["method"]
  puts fetchdef["headers"]
rescue => err
  warn "prepare failed: #{err}"
end
```

### Use test mode

Create a mock client for unit testing — no server required:

```ruby
client = FastgpuSDK.test

# list returns an Array of Match entities, one per mock record (raises on
# error); data_get reads each record.
matchs = client.Match.list({ "query" => "example" })
matchs.each { |item| puts item.data_get }
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```ruby
mock_fetch = ->(url, init) {
  return {
    "status" => 200,
    "statusText" => "OK",
    "headers" => {},
    "json" => ->() { { "id" => "mock01" } },
  }, nil
}

client = FastgpuSDK.new({
  "base" => "http://localhost:8080",
  "system" => {
    "fetch" => mock_fetch,
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
cd rb && ruby -Itest -e "Dir['test/*_test.rb'].each { |f| require_relative f }"
```


## Reference

### FastgpuSDK

```ruby
require_relative "Fastgpu_sdk"
client = FastgpuSDK.new(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `String` | API key for authentication. |
| `base` | `String` | Base URL of the API server. |
| `prefix` | `String` | URL path prefix prepended to all requests. |
| `suffix` | `String` | URL path suffix appended to all requests. |
| `feature` | `Hash` | Feature activation flags. |
| `extend` | `Hash` | Additional Feature instances to load. |
| `system` | `Hash` | System overrides (e.g. custom `fetch` lambda). |

### test

```ruby
client = FastgpuSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### FastgpuSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> Hash` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> Hash` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> Hash` | Build and send an HTTP request. Returns a result hash (`result["ok"]`); does not raise. |
| `Match` | `(data) -> MatchEntity` | Create a Match entity instance. |
| `Price` | `(data) -> PriceEntity` | Create a Price entity instance. |
| `Router` | `(data) -> RouterEntity` | Create a Router entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch = nil, ctrl) -> Array` | List entities matching the criteria (call with no argument to list all), one per record. Raises on error. |
| `create` | `(reqdata, ctrl) -> any` | Create a new entity, and return it. Raises on error. |
| `remove` | `(reqmatch, ctrl) -> any` | Remove an entity, and return it marked as deleted. Raises on error. |
| `data_get` | `() -> Hash` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> Hash` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> String` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `Array` of entities, one
per record; an entity's `data_get` reads its record. On failure they raise a
`FastgpuError` (a `StandardError` subclass), so wrap calls in
`begin`/`rescue` where you need to handle errors.

The `direct` escape hatch is the exception: it never raises and instead
returns a result `Hash` with these keys:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `Boolean` | `true` if the HTTP status is 2xx. |
| `status` | `Integer` | HTTP status code. |
| `headers` | `Hash` | Response headers. |
| `data` | `any` | Parsed JSON response body. |
| `err` | `Error` | Present when `ok` is `false`. |

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

Create an instance: `match = client.Match`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `billed_hours` | `Object` | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `String` | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `Float` |  |
| `estimated_total_usd` | `Object` | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `Object` | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `Boolean` |  |
| `gpu` | `String` |  |
| `gpu_count` | `Integer` |  |
| `monthly_usd` | `Float` |  |
| `offer_type` | `String` |  |
| `over_budget` | `Boolean` |  |
| `page_url` | `String` | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `Boolean` |  |
| `provider` | `String` |  |
| `provider_label` | `Object` |  |
| `quote_age_seconds` | `Object` | Seconds between fetched_at and as_of. |
| `reason` | `String` |  |
| `reliability` | `String` |  |
| `score` | `Object` |  |
| `tokens_per_sec` | `Object` |  |
| `url` | `String` | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `Object` |  |

#### Example: List

```ruby
# list returns an Array of Match entities, one per record (raises on error).
matchs = client.Match.list({ "query" => "example" })
matchs.each { |item| puts item.data_get }
```


### Price

Create an instance: `price = client.Price`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `arch` | `Object` |  |
| `carried_providers` | `Integer` |  |
| `cheapest_billed_separately` | `Object` |  |
| `cheapest_min_gpu_count` | `Object` |  |
| `cheapest_provider` | `Object` |  |
| `cheapest_usd_hr` | `Object` |  |
| `degraded_providers` | `String` |  |
| `fixing_date` | `String` |  |
| `floor_availability` | `Object` |  |
| `floor_billed_separately` | `Object` |  |
| `floor_min_gpu_count` | `Object` |  |
| `floor_offer_type` | `Object` |  |
| `floor_provider` | `Object` |  |
| `floor_provider_label` | `Object` |  |
| `floor_usd_hr` | `Object` |  |
| `gpu` | `String` |  |
| `gpu_model` | `String` |  |
| `gpu_slug` | `String` |  |
| `hyperscaler_median_usd_hr` | `Object` |  |
| `hyperscaler_providers` | `Integer` |  |
| `in_stock_offers` | `Integer` |  |
| `method_version` | `String` |  |
| `offer_count` | `Integer` |  |
| `on_demand_median_usd_hr` | `Object` |  |
| `on_demand_offers` | `Integer` |  |
| `on_demand_providers` | `Integer` |  |
| `page_url` | `String` | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `Integer` |  |
| `slug` | `String` |  |
| `snapshot_at` | `String` |  |
| `spot_floor_availability` | `Object` |  |
| `spot_floor_billed_separately` | `Object` |  |
| `spot_floor_min_gpu_count` | `Object` |  |
| `spot_floor_provider` | `Object` |  |
| `spot_floor_provider_label` | `Object` |  |
| `spot_floor_usd_hr` | `Object` |  |
| `spot_providers` | `Integer` |  |
| `stock_known_offers` | `Integer` |  |
| `tier` | `Object` |  |
| `url` | `String` | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `Object` |  |
| `vram_gb` | `Object` |  |

#### Example: Load

```ruby
# load returns the ENTITY — call data_get for the Price record (raises on error).
price = client.Price.load()
```

#### Example: List

```ruby
# list returns an Array of Price entities, one per record (raises on error).
prices = client.Price.list
prices.each { |item| puts item.data_get }
```


### Router

Create an instance: `router = client.Router`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `remove(match)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `String` |  |

#### Example: Create

```ruby
router = client.Router.create({
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

Features are the extension mechanism. A feature is a Ruby class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as hashes

The Ruby SDK uses plain Ruby hashes throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers.to_map()` to safely validate that a value is a hash.

### Module structure

```
rb/
├── Fastgpu_sdk.rb       -- Main SDK module
├── config.rb                  -- Configuration
├── schema.rb                  -- Generated option + entity specs
├── features.rb                -- Feature factory
├── core/                      -- Core types and context
├── entity/                    -- Entity implementations
├── feature/                   -- Built-in features (Base, Test, Log)
├── utility/                   -- Utility functions and struct library
└── test/                      -- Test suites
```

The main module (`Fastgpu_sdk`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```ruby
match = client.Match
match.list({ "query" => "example" })

# match.data_get now returns the match data from the last list
# match.match_get returns the last match criteria
```

Call `make` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`direct` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `prepare` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
