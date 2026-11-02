# Fastgpu Golang SDK



The Golang SDK for the Fastgpu API — an entity-oriented client using standard Go conventions. No generics required; data flows as `map[string]any`.

It exposes the API as capitalised, semantic **Entities** — e.g. `client.Match(nil)` — each with the same small set of operations (`List`, `Load`, `Create`, `Remove`) instead of raw URL paths and query strings. You call meaning, not endpoints, which keeps the cognitive load low.

> Also generated from this model: `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb`, `ts` — see
> the [top-level README](../README.md).


## Install
```bash
go get github.com/voxgig-sdk/fastgpu-sdk/go@latest
```

The Go module proxy resolves the version from the `go/vX.Y.Z` GitHub
release tag — see [Tags](https://github.com/voxgig-sdk/fastgpu-sdk/tags) for the available versions.

To vendor from a local checkout instead, clone this repo alongside your
project and add a `replace` directive pointing at the checked-out
`go/` directory:

```bash
go mod edit -replace github.com/voxgig-sdk/fastgpu-sdk/go=../fastgpu-sdk/go
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### Quickstart

A complete program: create a client, then call the entity operations.
Each operation returns `(value, error)` — the value is the entity, and for
`List` a `[]any` of entities, one per record (there is no `{ok, data}`
wrapper), so check `err` and read a record through the entity's
`Data()`.

```go
package main

import (
    "fmt"
    "os"
    sdk "github.com/voxgig-sdk/fastgpu-sdk/go"
)

func main() {
    client := sdk.NewFastgpuSDK(map[string]any{
        "apikey": os.Getenv("FASTGPU_APIKEY"),
    })

    // List match records — the value is a []any of entities, one per record.
    matchs, err := client.Match(nil).List(map[string]any{"query": "example"}, nil)
    if err != nil {
        panic(err)
    }
    for _, item := range matchs.([]any) {
        fmt.Println(item.(sdk.Entity).Data())
    }
}
```


## Error handling

Every entity operation returns `(value, error)`. Check `err` before
using the value — there is no exception to catch:

```go
matchs, err := client.Match(nil).List(map[string]any{"query": "example"}, nil)
if err != nil {
    // handle err
    return
}
_ = matchs
```

`Direct` follows the same `(value, error)` convention:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example_id"},
})
if err != nil {
    // handle err
}
_ = result
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

if result["ok"] == true {
    fmt.Println(result["status"]) // 200
    fmt.Println(result["data"])   // response body
}
```

### Prepare a request without sending it

```go
fetchdef, err := client.Prepare(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "DELETE",
    "params": map[string]any{"id": "example"},
})
if err != nil {
    panic(err)
}

fmt.Println(fetchdef["url"])
fmt.Println(fetchdef["method"])
fmt.Println(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```go
client := sdk.Test()

matchs, err := client.Match(nil).List(
    map[string]any{"query": "example"}, nil,
)
if err != nil {
    panic(err)
}
// A []any of entities, one per mock record.
for _, item := range matchs.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```go
mockFetch := func(url string, init map[string]any) (map[string]any, error) {
    return map[string]any{
        "status":     200,
        "statusText": "OK",
        "headers":    map[string]any{},
        "json": (func() any)(func() any {
            return map[string]any{"id": "mock01"}
        }),
    }, nil
}

client := sdk.NewFastgpuSDK(map[string]any{
    "base": "http://localhost:8080",
    "system": map[string]any{
        "fetch": (func(string, map[string]any) (map[string]any, error))(mockFetch),
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
cd go && go test ./test/...
```


## Reference

### NewFastgpuSDK

```go
func NewFastgpuSDK(options map[string]any) *FastgpuSDK
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `"apikey"` | `string` | API key for authentication. |
| `"base"` | `string` | Base URL of the API server. |
| `"prefix"` | `string` | URL path prefix prepended to all requests. |
| `"suffix"` | `string` | URL path suffix appended to all requests. |
| `"feature"` | `map[string]any` | Feature activation flags. |
| `"extend"` | `[]any` | Additional Feature instances to load. |
| `"system"` | `map[string]any` | System overrides (e.g. custom `"fetch"` function). |

### TestSDK

```go
func TestSDK(testopts map[string]any, sdkopts map[string]any) *FastgpuSDK
```

Creates a test-mode client with mock transport. Both arguments may be `nil`.

### FastgpuSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `OptionsMap` | `() map[string]any` | Deep copy of current SDK options. |
| `GetUtility` | `() *Utility` | Copy of the SDK utility object. |
| `Prepare` | `(fetchargs map[string]any) (map[string]any, error)` | Build an HTTP request definition without sending. |
| `Direct` | `(fetchargs map[string]any) (map[string]any, error)` | Build and send an HTTP request. |
| `Match` | `(data map[string]any) FastgpuEntityBase` | Create a Match entity instance. |
| `Price` | `(data map[string]any) FastgpuEntityBase` | Create a Price entity instance. |
| `Router` | `(data map[string]any) FastgpuEntityBase` | Create a Router entity instance. |

### Entity interface (FastgpuEntityBase)

All entities implement the `FastgpuEntityBase` interface.

| Method | Signature | Description |
| --- | --- | --- |
| `Load` | `(reqmatch, ctrl map[string]any) (any, error)` | Load a single entity by match criteria, and return it. |
| `List` | `(reqmatch, ctrl map[string]any) (any, error)` | List entities matching the criteria, one per record. |
| `Create` | `(reqdata, ctrl map[string]any) (any, error)` | Create a new entity, and return it. |
| `Remove` | `(reqmatch, ctrl map[string]any) (any, error)` | Remove an entity, and return it marked as deleted. |
| `Data` | `(args ...any) any` | Get or set entity data. |
| `Match` | `(args ...any) any` | Get or set entity match criteria. |
| `Make` | `() Entity` | Create a new instance with the same options. |
| `GetName` | `() string` | Return the entity name. |

### Result shape

Entity operations return `(value, error)`. The `value` is the entity
itself — there is no wrapper:

| Operation | `value` |
| --- | --- |
| `Load` / `Create` / `Remove` | the entity, whose `Data()` reads its record (`map[string]any`) |
| `List` | a `[]any` of entities, one per record |

Check `err` first, then use the value directly (or the typed
`...Typed` variants, which return the entity's model struct and a typed
slice):

    match, err := client.Match(nil).List(map[string]any{"query": "example"}, nil)
    if err != nil { /* handle */ }
    // match is a []any of entities, one per record

Only `Direct()` returns a response envelope — a `map[string]any` with
`"ok"`, `"status"`, `"headers"`, and `"data"` keys.

### Entities

#### Match

| Field | Description |
| --- | --- |
| `"billed_hours"` | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `"billing_increment"` | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `"effective_usd_hr"` |  |
| `"estimated_total_usd"` | effective_usd_hr times billed_hours, rounded up to the cent. |
| `"fetched_at"` | When this price was fetched from the provider (ISO 8601). |
| `"fits_single_card"` |  |
| `"gpu"` |  |
| `"gpu_count"` |  |
| `"monthly_usd"` |  |
| `"offer_type"` |  |
| `"over_budget"` |  |
| `"page_url"` | Absolute URL of this GPU's live price page, with every live offer. |
| `"partner"` |  |
| `"provider"` |  |
| `"provider_label"` |  |
| `"quote_age_seconds"` | Seconds between fetched_at and as_of. |
| `"reason"` |  |
| `"reliability"` |  |
| `"score"` |  |
| `"tokens_per_sec"` |  |
| `"url"` | Site-relative path of this GPU's live price page, e.g. |
| `"usd_per_million_tokens"` |  |

Operations: List.

API path: `/api/v1/match`

#### Price

| Field | Description |
| --- | --- |
| `"arch"` |  |
| `"carried_providers"` |  |
| `"cheapest_billed_separately"` |  |
| `"cheapest_min_gpu_count"` |  |
| `"cheapest_provider"` |  |
| `"cheapest_usd_hr"` |  |
| `"degraded_providers"` |  |
| `"fixing_date"` |  |
| `"floor_availability"` |  |
| `"floor_billed_separately"` |  |
| `"floor_min_gpu_count"` |  |
| `"floor_offer_type"` |  |
| `"floor_provider"` |  |
| `"floor_provider_label"` |  |
| `"floor_usd_hr"` |  |
| `"gpu"` |  |
| `"gpu_model"` |  |
| `"gpu_slug"` |  |
| `"hyperscaler_median_usd_hr"` |  |
| `"hyperscaler_providers"` |  |
| `"in_stock_offers"` |  |
| `"method_version"` |  |
| `"offer_count"` |  |
| `"on_demand_median_usd_hr"` |  |
| `"on_demand_offers"` |  |
| `"on_demand_providers"` |  |
| `"page_url"` | Absolute URL of this GPU's live price page, with every live offer. |
| `"provider_count"` |  |
| `"slug"` |  |
| `"snapshot_at"` |  |
| `"spot_floor_availability"` |  |
| `"spot_floor_billed_separately"` |  |
| `"spot_floor_min_gpu_count"` |  |
| `"spot_floor_provider"` |  |
| `"spot_floor_provider_label"` |  |
| `"spot_floor_usd_hr"` |  |
| `"spot_providers"` |  |
| `"stock_known_offers"` |  |
| `"tier"` |  |
| `"url"` | Site-relative path of this GPU's live price page, e.g. |
| `"vendor"` |  |
| `"vram_gb"` |  |

Operations: List, Load.

API path: `/api/v1/fixings`

#### Router

| Field | Description |
| --- | --- |
| `"id"` |  |

Operations: Create, Remove.

API path: `/api/v1/router/launch`



## Entities


### Match

Create an instance: `match := client.Match(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `billed_hours` | `any` | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `string` | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `float64` |  |
| `estimated_total_usd` | `any` | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `any` | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `bool` |  |
| `gpu` | `string` |  |
| `gpu_count` | `int` |  |
| `monthly_usd` | `float64` |  |
| `offer_type` | `string` |  |
| `over_budget` | `bool` |  |
| `page_url` | `string` | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `bool` |  |
| `provider` | `string` |  |
| `provider_label` | `any` |  |
| `quote_age_seconds` | `any` | Seconds between fetched_at and as_of. |
| `reason` | `string` |  |
| `reliability` | `string` |  |
| `score` | `any` |  |
| `tokens_per_sec` | `any` |  |
| `url` | `string` | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `any` |  |

#### Example: List

```go
matchs, err := client.Match(nil).List(map[string]any{"query": "example"}, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range matchs.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Price

Create an instance: `price := client.Price(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `List(match, ctrl)` | List entities matching the criteria. |
| `Load(match, ctrl)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `arch` | `any` |  |
| `carried_providers` | `int` |  |
| `cheapest_billed_separately` | `any` |  |
| `cheapest_min_gpu_count` | `any` |  |
| `cheapest_provider` | `any` |  |
| `cheapest_usd_hr` | `any` |  |
| `degraded_providers` | `string` |  |
| `fixing_date` | `string` |  |
| `floor_availability` | `any` |  |
| `floor_billed_separately` | `any` |  |
| `floor_min_gpu_count` | `any` |  |
| `floor_offer_type` | `any` |  |
| `floor_provider` | `any` |  |
| `floor_provider_label` | `any` |  |
| `floor_usd_hr` | `any` |  |
| `gpu` | `string` |  |
| `gpu_model` | `string` |  |
| `gpu_slug` | `string` |  |
| `hyperscaler_median_usd_hr` | `any` |  |
| `hyperscaler_providers` | `int` |  |
| `in_stock_offers` | `int` |  |
| `method_version` | `string` |  |
| `offer_count` | `int` |  |
| `on_demand_median_usd_hr` | `any` |  |
| `on_demand_offers` | `int` |  |
| `on_demand_providers` | `int` |  |
| `page_url` | `string` | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `int` |  |
| `slug` | `string` |  |
| `snapshot_at` | `string` |  |
| `spot_floor_availability` | `any` |  |
| `spot_floor_billed_separately` | `any` |  |
| `spot_floor_min_gpu_count` | `any` |  |
| `spot_floor_provider` | `any` |  |
| `spot_floor_provider_label` | `any` |  |
| `spot_floor_usd_hr` | `any` |  |
| `spot_providers` | `int` |  |
| `stock_known_offers` | `int` |  |
| `tier` | `any` |  |
| `url` | `string` | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `any` |  |
| `vram_gb` | `any` |  |

#### Example: Load

```go
price, err := client.Price(nil).Load(nil, nil)
if err != nil {
    panic(err)
}
fmt.Println(price.(sdk.Entity).Data()) // the loaded entity's record
```

#### Example: List

```go
prices, err := client.Price(nil).List(nil, nil)
if err != nil {
    panic(err)
}
// A []any of entities, one per record.
for _, item := range prices.([]any) {
    fmt.Println(item.(sdk.Entity).Data())
}
```


### Router

Create an instance: `router := client.Router(nil)`

#### Operations

| Method | Description |
| --- | --- |
| `Create(data, ctrl)` | Create a new entity with the given data. |
| `Remove(match, ctrl)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` |  |

#### Example: Create

```go
result, err := client.Router(nil).Create(map[string]any{
}, nil)
if err != nil {
    panic(err)
}
fmt.Println(result.(sdk.Entity).Data()) // the created entity's record
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

Features are the extension mechanism. A feature implements the
`Feature` interface and provides hooks — functions keyed by pipeline
stage names.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as maps

The Go SDK uses `map[string]any` throughout rather than typed structs.
This mirrors the dynamic nature of the API and keeps the SDK
flexible — no code generation is needed when the API schema changes.

An operation returns the entity, and its `Data()` returns the record. Use
`core.ToMapAny()` to safely cast that record, or data nested in it, to
`map[string]any`: it returns `nil` for anything else, an entity included.

### Package structure

```
github.com/voxgig-sdk/fastgpu-sdk/go/
├── fastgpu.go        # Root package — type aliases and constructors
├── core/               # SDK core — client, types, pipeline
├── entity/             # Entity implementations
├── feature/            # Built-in features (Base, Test, Log)
├── utility/            # Utility functions and struct library
└── test/               # Test suites
```

The root package (`github.com/voxgig-sdk/fastgpu-sdk/go`) re-exports everything needed
for normal use. Import sub-packages only when you need specific types
like `core.ToMapAny`.

### Entity state

Entity instances are stateful. After a successful `List`, the entity
stores the returned data and match criteria internally.

```go
match := client.Match(nil)
match.List(map[string]any{"query": "example"}, nil)

// match.Data() now returns the match data from the last list
// match.Match() returns the last match criteria
```

Call `Make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

`Direct()` gives full control over the HTTP request. Use it for
non-standard endpoints, bulk operations, or any path not modelled as
an entity. `Prepare()` builds the request without sending it — useful
for debugging or custom transport.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
