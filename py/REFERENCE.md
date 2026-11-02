# Fastgpu Python SDK Reference

Complete API reference for the Fastgpu Python SDK.


## FastgpuSDK

### Constructor

```python
from fastgpu_sdk import FastgpuSDK

client = FastgpuSDK(options)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `dict` | SDK configuration options. |
| `options["apikey"]` | `str` | API key for authentication. |
| `options["base"]` | `str` | Base URL for API requests. |
| `options["prefix"]` | `str` | URL prefix appended after base. |
| `options["suffix"]` | `str` | URL suffix appended after path. |
| `options["headers"]` | `dict` | Custom headers for all requests. |
| `options["feature"]` | `dict` | Feature configuration. |
| `options["system"]` | `dict` | System overrides (e.g. custom fetch). |


### Static Methods

#### `FastgpuSDK.test(testopts=None, sdkopts=None)`

Create a test client with mock features active. Both arguments may be `None`.

```python
client = FastgpuSDK.test()
```


### Instance Methods

#### `Match(data=None)`

Create a new `MatchEntity` instance. Pass `None` for no initial data.

#### `Price(data=None)`

Create a new `PriceEntity` instance. Pass `None` for no initial data.

#### `Router(data=None)`

Create a new `RouterEntity` instance. Pass `None` for no initial data.

#### `options_map() -> dict`

Return a deep copy of the current SDK options.

#### `get_utility() -> Utility`

Return a copy of the SDK utility object.

#### `direct(fetchargs=None) -> dict`

Make a direct HTTP request to any API endpoint. Returns a result `dict` with `ok`, `status`, `headers`, and `data` (or `err` on failure). This escape hatch never raises — branch on `result["ok"]`.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs["path"]` | `str` | URL path with optional `{param}` placeholders. |
| `fetchargs["method"]` | `str` | HTTP method (default: `"GET"`). |
| `fetchargs["params"]` | `dict` | Path parameter values. |
| `fetchargs["query"]` | `dict` | Query string parameters. |
| `fetchargs["headers"]` | `dict` | Request headers (merged with defaults). |
| `fetchargs["body"]` | `any` | Request body (dicts are JSON-serialized). |

**Returns:** `result_dict`

#### `prepare(fetchargs=None) -> dict`

Prepare a fetch definition without sending. Returns the `fetchdef` and raises on error.


---

## MatchEntity

```python
match = client.Match()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `billed_hours` | `float | None` | No | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `str` | No | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `float` | No |  |
| `estimated_total_usd` | `float | None` | No | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `str | None` | No | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `bool` | No |  |
| `gpu` | `str` | No |  |
| `gpu_count` | `int` | No |  |
| `monthly_usd` | `float` | No |  |
| `offer_type` | `str` | No |  |
| `over_budget` | `bool` | No |  |
| `page_url` | `str` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `bool` | No |  |
| `provider` | `str` | No |  |
| `provider_label` | `str | None` | No |  |
| `quote_age_seconds` | `int | None` | No | Seconds between fetched_at and as_of. |
| `reason` | `str` | No |  |
| `reliability` | `str` | No |  |
| `score` | `float | None` | No |  |
| `tokens_per_sec` | `float | None` | No |  |
| `url` | `str` | No | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `float | None` | No |  |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[MatchEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Match().list({"query": "example"})
for match in results:
    print(match.data_get())
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `MatchEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## PriceEntity

```python
price = client.Price()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `arch` | `str | None` | No |  |
| `carried_providers` | `int` | No |  |
| `cheapest_billed_separately` | `str | None` | No |  |
| `cheapest_min_gpu_count` | `int | None` | No |  |
| `cheapest_provider` | `str | None` | No |  |
| `cheapest_usd_hr` | `float | None` | No |  |
| `degraded_providers` | `str` | No |  |
| `fixing_date` | `str` | No |  |
| `floor_availability` | `str | None` | No |  |
| `floor_billed_separately` | `str | None` | No |  |
| `floor_min_gpu_count` | `int | None` | No |  |
| `floor_offer_type` | `str | None` | No |  |
| `floor_provider` | `str | None` | No |  |
| `floor_provider_label` | `str | None` | No |  |
| `floor_usd_hr` | `float | None` | No |  |
| `gpu` | `str` | No |  |
| `gpu_model` | `str` | No |  |
| `gpu_slug` | `str` | No |  |
| `hyperscaler_median_usd_hr` | `float | None` | No |  |
| `hyperscaler_providers` | `int` | No |  |
| `in_stock_offers` | `int` | No |  |
| `method_version` | `str` | No |  |
| `offer_count` | `int` | No |  |
| `on_demand_median_usd_hr` | `float | None` | No |  |
| `on_demand_offers` | `int` | No |  |
| `on_demand_providers` | `int` | No |  |
| `page_url` | `str` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `int` | No |  |
| `slug` | `str` | No |  |
| `snapshot_at` | `str` | No |  |
| `spot_floor_availability` | `str | None` | No |  |
| `spot_floor_billed_separately` | `str | None` | No |  |
| `spot_floor_min_gpu_count` | `int | None` | No |  |
| `spot_floor_provider` | `str | None` | No |  |
| `spot_floor_provider_label` | `str | None` | No |  |
| `spot_floor_usd_hr` | `float | None` | No |  |
| `spot_providers` | `int` | No |  |
| `stock_known_offers` | `int` | No |  |
| `tier` | `str | None` | No |  |
| `url` | `str` | No | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `str | None` | No |  |
| `vram_gb` | `float | None` | No |  |

### Operations

#### `list(reqmatch=None, ctrl=None) -> list[PriceEntity]`

List entities matching the given criteria. The match is optional — call `list()` with no argument to list all records. Returns a list of entities, one per record, and raises on error.

```python
results = client.Price().list()
for price in results:
    print(price.data_get())
```

#### `load(reqmatch, ctrl=None) -> PriceEntity`

Load a single entity matching the given criteria. Returns the entity, whose record `data_get()` reads, and raises on error.

```python
result = client.Price().load()
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `PriceEntity` instance with the same options.

#### `get_name() -> str`

Return the entity name.


---

## RouterEntity

```python
router = client.Router()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `str` | No |  |

### Operations

#### `create(reqdata, ctrl=None) -> RouterEntity`

Create a new entity with the given data. Returns the created entity and raises on error.

```python
result = client.Router().create({
})
```

#### `remove(reqmatch, ctrl=None) -> RouterEntity`

Remove the entity matching the given criteria. Returns the entity, marked as deleted, and raises on error.

```python
result = client.Router().remove({"id": "router_id"})
```

### Common Methods

#### `data_get() -> dict`

Get the entity data.

#### `data_set(data)`

Set the entity data.

#### `match_get() -> dict`

Get the entity match criteria.

#### `match_set(match)`

Set the entity match criteria.

#### `make() -> Entity`

Create a new `RouterEntity` instance with the same options.

#### `get_name() -> str`

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

```python
client = FastgpuSDK({
    "feature": {
        "ratelimit": {"active": True},
        "retry": {"active": True},
        "test": {"active": True},
        "timeout": {"active": True},
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

