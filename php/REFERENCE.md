# Fastgpu PHP SDK Reference

Complete API reference for the Fastgpu PHP SDK.


## FastgpuSDK

### Constructor

```php
require_once __DIR__ . '/fastgpu_sdk.php';

$client = new FastgpuSDK($options);
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `$options` | `array` | SDK configuration options. |
| `$options["apikey"]` | `string` | API key for authentication. |
| `$options["base"]` | `string` | Base URL for API requests. |
| `$options["prefix"]` | `string` | URL prefix appended after base. |
| `$options["suffix"]` | `string` | URL suffix appended after path. |
| `$options["headers"]` | `array` | Custom headers for all requests. |
| `$options["feature"]` | `array` | Feature configuration. |
| `$options["system"]` | `array` | System overrides (e.g. custom fetch). |


### Static Methods

#### `FastgpuSDK::test($testopts = null, $sdkopts = null)`

Create a test client with mock features active. Both arguments may be `null`.

```php
$client = FastgpuSDK::test();
```


### Instance Methods

#### `Match($data = null)`

Create a new `MatchEntity` instance. Pass `null` for no initial data.

#### `Price($data = null)`

Create a new `PriceEntity` instance. Pass `null` for no initial data.

#### `Router($data = null)`

Create a new `RouterEntity` instance. Pass `null` for no initial data.

#### `options_map(): array`

Return a deep copy of the current SDK options.

#### `get_utility(): FastgpuUtility`

Return a copy of the SDK utility object.

#### `direct(array $fetchargs = []): array`

Make a direct HTTP request to any API endpoint. This is the raw-HTTP escape
hatch: it does **not** throw. It returns a result array
`["ok" => bool, "status" => int, "headers" => array, "data" => mixed]`, or
`["ok" => false, "err" => \Exception]` on failure. Branch on `$result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `$fetchargs["path"]` | `string` | URL path with optional `{param}` placeholders. |
| `$fetchargs["method"]` | `string` | HTTP method (default: `"GET"`). |
| `$fetchargs["params"]` | `array` | Path parameter values for `{param}` substitution. |
| `$fetchargs["query"]` | `array` | Query string parameters. |
| `$fetchargs["headers"]` | `array` | Request headers (merged with defaults). |
| `$fetchargs["body"]` | `mixed` | Request body (arrays are JSON-serialized). |
| `$fetchargs["ctrl"]` | `array` | Control options. |

**Returns:** `array` — the result dict (see above); never throws.

#### `prepare(array $fetchargs = []): mixed`

Prepare a fetch definition without sending the request. Returns the
`$fetchdef` array. Throws on error.


---

## MatchEntity

```php
$match = $client->Match();
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `billed_hours` | `mixed` | No | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `string` | No | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `float` | No |  |
| `estimated_total_usd` | `mixed` | No | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `mixed` | No | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `bool` | No |  |
| `gpu` | `string` | No |  |
| `gpu_count` | `int` | No |  |
| `monthly_usd` | `float` | No |  |
| `offer_type` | `string` | No |  |
| `over_budget` | `bool` | No |  |
| `page_url` | `string` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `bool` | No |  |
| `provider` | `string` | No |  |
| `provider_label` | `mixed` | No |  |
| `quote_age_seconds` | `mixed` | No | Seconds between fetched_at and as_of. |
| `reason` | `string` | No |  |
| `reliability` | `string` | No |  |
| `score` | `mixed` | No |  |
| `tokens_per_sec` | `mixed` | No |  |
| `url` | `string` | No | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `mixed` | No |  |

### Operations

#### `list(?array $reqmatch = null, ?array $ctrl = null): mixed`

List entities matching the given criteria (call with no argument to list all). Returns an array of entities, one per record, and throws on error.

```php
$results = $client->Match()->list(["query" => "example"]);
```

### Common Methods

#### `data_get(): array`

Get the entity data. Returns a copy of the current data.

#### `data_set($data): void`

Set the entity data.

#### `match_get(): array`

Get the entity match criteria.

#### `match_set($match): void`

Set the entity match criteria.

#### `make(): MatchEntity`

Create a new `MatchEntity` instance with the same client and
options.

#### `get_name(): string`

Return the entity name.


---

## PriceEntity

```php
$price = $client->Price();
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `arch` | `mixed` | No |  |
| `carried_providers` | `int` | No |  |
| `cheapest_billed_separately` | `mixed` | No |  |
| `cheapest_min_gpu_count` | `mixed` | No |  |
| `cheapest_provider` | `mixed` | No |  |
| `cheapest_usd_hr` | `mixed` | No |  |
| `degraded_providers` | `string` | No |  |
| `fixing_date` | `string` | No |  |
| `floor_availability` | `mixed` | No |  |
| `floor_billed_separately` | `mixed` | No |  |
| `floor_min_gpu_count` | `mixed` | No |  |
| `floor_offer_type` | `mixed` | No |  |
| `floor_provider` | `mixed` | No |  |
| `floor_provider_label` | `mixed` | No |  |
| `floor_usd_hr` | `mixed` | No |  |
| `gpu` | `string` | No |  |
| `gpu_model` | `string` | No |  |
| `gpu_slug` | `string` | No |  |
| `hyperscaler_median_usd_hr` | `mixed` | No |  |
| `hyperscaler_providers` | `int` | No |  |
| `in_stock_offers` | `int` | No |  |
| `method_version` | `string` | No |  |
| `offer_count` | `int` | No |  |
| `on_demand_median_usd_hr` | `mixed` | No |  |
| `on_demand_offers` | `int` | No |  |
| `on_demand_providers` | `int` | No |  |
| `page_url` | `string` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `int` | No |  |
| `slug` | `string` | No |  |
| `snapshot_at` | `string` | No |  |
| `spot_floor_availability` | `mixed` | No |  |
| `spot_floor_billed_separately` | `mixed` | No |  |
| `spot_floor_min_gpu_count` | `mixed` | No |  |
| `spot_floor_provider` | `mixed` | No |  |
| `spot_floor_provider_label` | `mixed` | No |  |
| `spot_floor_usd_hr` | `mixed` | No |  |
| `spot_providers` | `int` | No |  |
| `stock_known_offers` | `int` | No |  |
| `tier` | `mixed` | No |  |
| `url` | `string` | No | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `mixed` | No |  |
| `vram_gb` | `mixed` | No |  |

### Operations

#### `list(?array $reqmatch = null, ?array $ctrl = null): mixed`

List entities matching the given criteria (call with no argument to list all). Returns an array of entities, one per record, and throws on error.

```php
$results = $client->Price()->list();
```

#### `load(array $reqmatch, ?array $ctrl = null): mixed`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and throws on error.

```php
$result = $client->Price()->load();
```

### Common Methods

#### `data_get(): array`

Get the entity data. Returns a copy of the current data.

#### `data_set($data): void`

Set the entity data.

#### `match_get(): array`

Get the entity match criteria.

#### `match_set($match): void`

Set the entity match criteria.

#### `make(): PriceEntity`

Create a new `PriceEntity` instance with the same client and
options.

#### `get_name(): string`

Return the entity name.


---

## RouterEntity

```php
$router = $client->Router();
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No |  |

### Operations

#### `create(array $reqdata, ?array $ctrl = null): mixed`

Create a new entity with the given data. Returns the created entity and throws on error.

```php
$result = $client->Router()->create([
]);
```

#### `remove(array $reqmatch, ?array $ctrl = null): mixed`

Remove the entity matching the given criteria. Returns the entity, marked as deleted, and throws on error.

```php
$result = $client->Router()->remove(["id" => "router_id"]);
```

### Common Methods

#### `data_get(): array`

Get the entity data. Returns a copy of the current data.

#### `data_set($data): void`

Set the entity data.

#### `match_get(): array`

Get the entity match criteria.

#### `match_set($match): void`

Set the entity match criteria.

#### `make(): RouterEntity`

Create a new `RouterEntity` instance with the same client and
options.

#### `get_name(): string`

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

```php
$client = new FastgpuSDK([
  "feature" => [
    "ratelimit" => ["active" => true],
    "retry" => ["active" => true],
    "test" => ["active" => true],
    "timeout" => ["active" => true],
  ],
]);
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

