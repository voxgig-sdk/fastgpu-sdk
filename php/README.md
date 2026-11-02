# Fastgpu PHP SDK



The PHP SDK for the Fastgpu API — an entity-oriented client using PHP conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `$client->Match()` — with named operations (`list`/`load`/`create`/`remove`) instead of raw URL paths and query strings. Working with resources and verbs keeps call sites self-describing and reduces cognitive load.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to Packagist. Install it from the
GitHub release tag (`php/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/fastgpu-sdk/tags)), or
from a clone as a Composer path repository:

```bash
git clone https://github.com/voxgig-sdk/fastgpu-sdk
composer config repositories.fastgpu-sdk path ./fastgpu-sdk/php
composer require voxgig-sdk/fastgpu-sdk:@dev
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```php
<?php
require_once 'fastgpu_sdk.php';

$client = new FastgpuSDK([
    "apikey" => getenv("FASTGPU_APIKEY"),
]);
```

### 2. List match records

```php
try {
    // list() returns entity instances; data_get() reads each record.
    $matchs = $client->Match()->list(["query" => "example"]);
    foreach ($matchs as $record) {
        $item = $record->data_get();
        echo $item["billed_hours"] . "\n";
    }
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```


## Error handling

Entity operations throw a `\Throwable` on failure, so wrap them in
`try` / `catch`:

```php
try {
    $matchs = $client->Match()->list(["query" => "example"]);
} catch (\Throwable $err) {
    echo "Error: " . $err->getMessage();
}
```

`direct()` does **not** throw — it returns the result array. Branch on
`ok`; on failure `status` holds the HTTP status (for error responses) and
`err` holds a transport error, so read both defensively:

```php
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example_id"],
]);

if (! $result["ok"]) {
    $err = $result["err"] ?? null;
    echo "request failed: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```php
// direct() is the raw-HTTP escape hatch: it returns a result array
// (it does not throw). Branch on $result["ok"].
$result = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example"],
]);

if ($result["ok"]) {
    echo $result["status"];  // 200
    print_r($result["data"]);  // response body
} else {
    // On an HTTP error status there is no err (only a transport failure sets
    // it), so fall back to the status code.
    $err = $result["err"] ?? null;
    echo "Error: " . ($err ? $err->getMessage() : "HTTP " . $result["status"]);
}
```

### Prepare a request without sending it

```php
// prepare() throws on error and returns the fetch definition.
$fetchdef = $client->prepare([
    "path" => "/api/resource/{id}",
    "method" => "DELETE",
    "params" => ["id" => "example"],
]);

echo $fetchdef["url"];
echo $fetchdef["method"];
print_r($fetchdef["headers"]);
```

### Use test mode

Create a mock client for unit testing — no server required. Seed fixture
data via the `entity` option so offline calls resolve without a live server:

```php
$client = FastgpuSDK::test([
    "entity" => ["router" => ["test01" => ["id" => "test01"]]],
]);

// Entity ops return the ENTITY (throws on error);
// call data_get() for the mock record.
$router = $client->Router()->create(["query" => "example"]);
print_r($router->data_get());
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```php
$mock_fetch = function ($url, $init) {
    return [
        [
            "status" => 200,
            "statusText" => "OK",
            "headers" => [],
            "json" => function () { return ["id" => "mock01"]; },
        ],
        null,
    ];
};

$client = new FastgpuSDK([
    "base" => "http://localhost:8080",
    "system" => [
        "fetch" => $mock_fetch,
    ],
]);
```

### Run live tests

Create a `.env.local` file at the project root:

```
FASTGPU_TEST_LIVE=TRUE
FASTGPU_APIKEY=<your-key>
```

Then run:

```bash
cd php && ./vendor/bin/phpunit test/
```


## Reference

### FastgpuSDK

```php
require_once 'fastgpu_sdk.php';
$client = new FastgpuSDK($options);
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `array` | Feature activation flags. |
| `extend` | `array` | Additional Feature instances to load. |
| `system` | `array` | System overrides (e.g. custom `fetch` callable). |

### test

```php
$client = FastgpuSDK::test($testopts, $sdkopts);
```

Creates a test-mode client with mock transport. Both arguments may be `null`.

### FastgpuSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `(): array` | Deep copy of current SDK options. |
| `get_utility` | `(): Utility` | Copy of the SDK utility object. |
| `prepare` | `(array $fetchargs): array` | Build an HTTP request definition without sending. |
| `direct` | `(array $fetchargs): array` | Build and send an HTTP request. |
| `Match` | `($data): MatchEntity` | Create a Match entity instance. |
| `Price` | `($data): PriceEntity` | Create a Price entity instance. |
| `Router` | `($data): RouterEntity` | Create a Router entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `($reqmatch, $ctrl): mixed` | Load a single entity by match criteria, and return it. |
| `list` | `(?array $reqmatch = null, $ctrl): mixed` | List entities matching the criteria (call with no argument to list all), one per record. |
| `create` | `($reqdata, $ctrl): mixed` | Create a new entity, and return it. |
| `remove` | `($reqmatch, $ctrl): mixed` | Remove an entity, and return it marked as deleted. |
| `data_get` | `(): array` | Get entity data. |
| `data_set` | `($data): void` | Set entity data. |
| `match_get` | `(): array` | Get entity match criteria. |
| `match_set` | `($match): void` | Set entity match criteria. |
| `make` | `(): Entity` | Create a new instance with the same options. |
| `get_name` | `(): string` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` an `array` of entities, one
per record; an entity's `data_get()` reads its record (an `array`). They
throw on error, so wrap calls in `try`/`catch` to handle failures.

The `direct()` escape hatch never throws — it returns a result `array`
you branch on via `$result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `true` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `array` | Response headers. |
| `data` | `mixed` | Parsed JSON response body. |

On error, `ok` is `false` and `$err` contains the error value.

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

Create an instance: `$match = $client->Match();`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `billed_hours` | `mixed` | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `string` | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `float` |  |
| `estimated_total_usd` | `mixed` | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `mixed` | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `bool` |  |
| `gpu` | `string` |  |
| `gpu_count` | `int` |  |
| `monthly_usd` | `float` |  |
| `offer_type` | `string` |  |
| `over_budget` | `bool` |  |
| `page_url` | `string` | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `bool` |  |
| `provider` | `string` |  |
| `provider_label` | `mixed` |  |
| `quote_age_seconds` | `mixed` | Seconds between fetched_at and as_of. |
| `reason` | `string` |  |
| `reliability` | `string` |  |
| `score` | `mixed` |  |
| `tokens_per_sec` | `mixed` |  |
| `url` | `string` | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `mixed` |  |

#### Example: List

```php
// list() returns an array of Match entities, one per record (throws on error).
$matchs = $client->Match()->list(["query" => "example"]);
```


### Price

Create an instance: `$price = $client->Price();`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `arch` | `mixed` |  |
| `carried_providers` | `int` |  |
| `cheapest_billed_separately` | `mixed` |  |
| `cheapest_min_gpu_count` | `mixed` |  |
| `cheapest_provider` | `mixed` |  |
| `cheapest_usd_hr` | `mixed` |  |
| `degraded_providers` | `string` |  |
| `fixing_date` | `string` |  |
| `floor_availability` | `mixed` |  |
| `floor_billed_separately` | `mixed` |  |
| `floor_min_gpu_count` | `mixed` |  |
| `floor_offer_type` | `mixed` |  |
| `floor_provider` | `mixed` |  |
| `floor_provider_label` | `mixed` |  |
| `floor_usd_hr` | `mixed` |  |
| `gpu` | `string` |  |
| `gpu_model` | `string` |  |
| `gpu_slug` | `string` |  |
| `hyperscaler_median_usd_hr` | `mixed` |  |
| `hyperscaler_providers` | `int` |  |
| `in_stock_offers` | `int` |  |
| `method_version` | `string` |  |
| `offer_count` | `int` |  |
| `on_demand_median_usd_hr` | `mixed` |  |
| `on_demand_offers` | `int` |  |
| `on_demand_providers` | `int` |  |
| `page_url` | `string` | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `int` |  |
| `slug` | `string` |  |
| `snapshot_at` | `string` |  |
| `spot_floor_availability` | `mixed` |  |
| `spot_floor_billed_separately` | `mixed` |  |
| `spot_floor_min_gpu_count` | `mixed` |  |
| `spot_floor_provider` | `mixed` |  |
| `spot_floor_provider_label` | `mixed` |  |
| `spot_floor_usd_hr` | `mixed` |  |
| `spot_providers` | `int` |  |
| `stock_known_offers` | `int` |  |
| `tier` | `mixed` |  |
| `url` | `string` | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `mixed` |  |
| `vram_gb` | `mixed` |  |

#### Example: Load

```php
// load() returns the ENTITY — call data_get() for the Price record (throws on error).
$price = $client->Price()->load();
```

#### Example: List

```php
// list() returns an array of Price entities, one per record (throws on error).
$prices = $client->Price()->list();
```


### Router

Create an instance: `$router = $client->Router();`

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

```php
$router = $client->Router()->create([
]);
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

Features are the extension mechanism. A feature is a PHP class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as arrays

The PHP SDK uses plain PHP associative arrays throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `Helpers::to_map()` to safely validate that a value is an array.

### Directory structure

```
php/
├── fastgpu_sdk.php          -- Main SDK class
├── config.php                     -- Configuration
├── schema.php                     -- Generated option + entity specs
├── features.php                   -- Feature factory
├── core/                          -- Core types and context
├── entity/                        -- Entity implementations
├── feature/                       -- Built-in features (Base, Test, Log)
├── utility/                       -- Utility functions and struct library
└── test/                          -- Test suites
```

The main class (`fastgpu_sdk.php`) exports the SDK class
and test helper. Import entity or utility modules directly only
when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```php
$match = $client->Match();
$match->list(["query" => "example"]);

// $match->data_get() now returns the match data from the last list
// $match->match_get() returns the last match criteria
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
