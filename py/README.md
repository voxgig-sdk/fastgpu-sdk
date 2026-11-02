# Fastgpu Python SDK



The Python SDK for the Fastgpu API — an entity-oriented client following Pythonic conventions.

The SDK exposes the API as capitalised, semantic **Entities** — for example `client.Match()` — each
carrying a small, uniform set of operations (`list`, `load`, `create`, `remove`) instead of raw URL
paths and query strings. You work with named resources and verbs, which
keeps the cognitive load low.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to PyPI. Install it from the GitHub
release tag (`py/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/fastgpu-sdk/tags)) or
from a source checkout:

```bash
pip install -e .
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```python
import os
from fastgpu_sdk import FastgpuSDK

client = FastgpuSDK({
    "apikey": os.environ.get("FASTGPU_APIKEY"),
})
```

### 2. List match records

`list()` returns a `list` of entities, one per record, and raises on
error; an entity's `data_get()` reads its record (a `dict`).

```python
try:
    matchs = client.Match().list({"query": "example"})
    for match in matchs:
        print(match.data_get())
except Exception as err:
    print(f"list failed: {err}")
```


## Error handling

Entity operations raise on failure, so wrap them in `try` / `except`:

```python
try:
    matchs = client.Match().list({"query": "example"})
    print([item.data_get() for item in matchs])
except Exception as err:
    print(f"list failed: {err}")
```

`direct()` does **not** raise — it returns the result envelope. Branch
on `ok`; on failure `status` holds the HTTP status (for error responses)
and `err` holds a transport error, so read both defensively:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example_id"},
})

if not result["ok"]:
    print("request failed:", result.get("status"), result.get("err"))
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```python
result = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
})

if result["ok"]:
    print(result["status"])  # 200
    print(result["data"])    # response body
else:
    # A non-2xx response carries status + data (the error body); a
    # transport-level failure carries err instead. Only one is present, so
    # read both with .get() rather than indexing a key that may be absent.
    print(result.get("status"), result.get("err"))
```

### Prepare a request without sending it

```python
# prepare() returns the fetch definition and raises on error.
fetchdef = client.prepare({
    "path": "/api/resource/{id}",
    "method": "DELETE",
    "params": {"id": "example"},
})

print(fetchdef["url"])
print(fetchdef["method"])
print(fetchdef["headers"])
```

### Use test mode

Create a mock client for unit testing — no server required:

```python
client = FastgpuSDK.test()

# Entity ops return the entity, and list one per record; they raise on error.
match = client.Match().list({"query": "example"})
# data_get() on an entity reads its mock response record
```

### Use a custom fetch function

Replace the HTTP transport with your own function:

```python
def mock_fetch(url, init):
    return {
        "status": 200,
        "statusText": "OK",
        "headers": {},
        "json": lambda: {"id": "mock01"},
    }, None

client = FastgpuSDK({
    "base": "http://localhost:8080",
    "system": {
        "fetch": mock_fetch,
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
cd py && pytest test/
```


## Reference

### FastgpuSDK

```python
from fastgpu_sdk import FastgpuSDK

client = FastgpuSDK(options)
```

Creates a new SDK client.

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `str` | API key for authentication. |
| `base` | `str` | Base URL of the API server. |
| `prefix` | `str` | URL path prefix prepended to all requests. |
| `suffix` | `str` | URL path suffix appended to all requests. |
| `feature` | `dict` | Feature activation flags. |
| `extend` | `list` | Additional Feature instances to load. |
| `system` | `dict` | System overrides (e.g. custom `fetch` function). |

### test

```python
client = FastgpuSDK.test(testopts, sdkopts)
```

Creates a test-mode client with mock transport. Both arguments may be `None`.

### FastgpuSDK methods

| Method | Signature | Description |
| --- | --- | --- |
| `options_map` | `() -> dict` | Deep copy of current SDK options. |
| `get_utility` | `() -> Utility` | Copy of the SDK utility object. |
| `prepare` | `(fetchargs) -> dict` | Build an HTTP request definition without sending. Raises on error. |
| `direct` | `(fetchargs) -> dict` | Build and send an HTTP request. Returns a result dict (branch on `ok`). |
| `Match` | `(data) -> MatchEntity` | Create a Match entity instance. |
| `Price` | `(data) -> PriceEntity` | Create a Price entity instance. |
| `Router` | `(data) -> RouterEntity` | Create a Router entity instance. |

### Entity interface

All entities share the same interface.

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `(reqmatch, ctrl) -> any` | Load a single entity by match criteria, and return it. Raises on error. |
| `list` | `(reqmatch, ctrl) -> list` | List entities matching the criteria, one per record. Raises on error. |
| `create` | `(reqdata, ctrl) -> any` | Create a new entity, and return it. Raises on error. |
| `remove` | `(reqmatch, ctrl) -> any` | Remove an entity, and return it marked as deleted. Raises on error. |
| `data_get` | `() -> dict` | Get entity data. |
| `data_set` | `(data)` | Set entity data. |
| `match_get` | `() -> dict` | Get entity match criteria. |
| `match_set` | `(match)` | Set entity match criteria. |
| `make` | `() -> Entity` | Create a new instance with the same options. |
| `get_name` | `() -> str` | Return the entity name. |

### Result shape

Entity operations return the entity, and `list` a `list` of entities, one
per record; an entity's `data_get()` reads its record (a `dict`). They raise
on error, so wrap calls in `try`/`except` to handle failures.

The `direct()` escape hatch never raises — it returns a result `dict`
you branch on via `result["ok"]`:

| Key | Type | Description |
| --- | --- | --- |
| `ok` | `bool` | `True` if the HTTP status is 2xx. |
| `status` | `int` | HTTP status code. |
| `headers` | `dict` | Response headers. |
| `data` | `any` | Parsed JSON response body. |

On error, `ok` is `False` and `err` contains the error value.

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

Create an instance: `match = client.Match()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `billed_hours` | `float | None` | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `str` | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `float` |  |
| `estimated_total_usd` | `float | None` | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `str | None` | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `bool` |  |
| `gpu` | `str` |  |
| `gpu_count` | `int` |  |
| `monthly_usd` | `float` |  |
| `offer_type` | `str` |  |
| `over_budget` | `bool` |  |
| `page_url` | `str` | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `bool` |  |
| `provider` | `str` |  |
| `provider_label` | `str | None` |  |
| `quote_age_seconds` | `int | None` | Seconds between fetched_at and as_of. |
| `reason` | `str` |  |
| `reliability` | `str` |  |
| `score` | `float | None` |  |
| `tokens_per_sec` | `float | None` |  |
| `url` | `str` | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `float | None` |  |

#### Example: List

```python
matchs = client.Match().list({"query": "example"})
```


### Price

Create an instance: `price = client.Price()`

#### Operations

| Method | Description |
| --- | --- |
| `list()` | List entities, optionally matching the given criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `arch` | `str | None` |  |
| `carried_providers` | `int` |  |
| `cheapest_billed_separately` | `str | None` |  |
| `cheapest_min_gpu_count` | `int | None` |  |
| `cheapest_provider` | `str | None` |  |
| `cheapest_usd_hr` | `float | None` |  |
| `degraded_providers` | `str` |  |
| `fixing_date` | `str` |  |
| `floor_availability` | `str | None` |  |
| `floor_billed_separately` | `str | None` |  |
| `floor_min_gpu_count` | `int | None` |  |
| `floor_offer_type` | `str | None` |  |
| `floor_provider` | `str | None` |  |
| `floor_provider_label` | `str | None` |  |
| `floor_usd_hr` | `float | None` |  |
| `gpu` | `str` |  |
| `gpu_model` | `str` |  |
| `gpu_slug` | `str` |  |
| `hyperscaler_median_usd_hr` | `float | None` |  |
| `hyperscaler_providers` | `int` |  |
| `in_stock_offers` | `int` |  |
| `method_version` | `str` |  |
| `offer_count` | `int` |  |
| `on_demand_median_usd_hr` | `float | None` |  |
| `on_demand_offers` | `int` |  |
| `on_demand_providers` | `int` |  |
| `page_url` | `str` | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `int` |  |
| `slug` | `str` |  |
| `snapshot_at` | `str` |  |
| `spot_floor_availability` | `str | None` |  |
| `spot_floor_billed_separately` | `str | None` |  |
| `spot_floor_min_gpu_count` | `int | None` |  |
| `spot_floor_provider` | `str | None` |  |
| `spot_floor_provider_label` | `str | None` |  |
| `spot_floor_usd_hr` | `float | None` |  |
| `spot_providers` | `int` |  |
| `stock_known_offers` | `int` |  |
| `tier` | `str | None` |  |
| `url` | `str` | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `str | None` |  |
| `vram_gb` | `float | None` |  |

#### Example: Load

```python
price = client.Price().load()
```

#### Example: List

```python
prices = client.Price().list()
```


### Router

Create an instance: `router = client.Router()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `remove(match)` | Remove the matching entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `str` |  |

#### Example: Create

```python
router = client.Router().create({
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

Features are the extension mechanism. A feature is a Python class
with hook methods named after pipeline stages (e.g. `PrePoint`,
`PreSpec`). Each method receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Data as dicts

The Python SDK uses plain dicts throughout rather than typed
objects. This mirrors the dynamic nature of the API and keeps the
SDK flexible — no code generation is needed when the API schema
changes.

Use `helpers.to_map()` to safely validate that a value is a dict.

### Module structure

```
py/
├── fastgpu_sdk.py         -- Main SDK module
├── config.py                    -- Configuration
├── schema.py                    -- Generated option + entity specs
├── features.py                  -- Feature factory
├── core/                        -- Core types and context
├── entity/                      -- Entity implementations
├── feature/                     -- Built-in features (Base, Test, Log)
├── utility/                     -- Utility functions and struct library
└── test/                        -- Test suites
```

The main module (`fastgpu_sdk`) exports the SDK class.
Import entity or utility modules directly only when needed.

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally.

```python
match = client.Match()
match.list({"query": "example"})

# match.data_get() now returns the match data from the last list
# match.match_get() returns the last match criteria
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
