# Fastgpu TypeScript SDK Reference

Complete API reference for the Fastgpu TypeScript SDK.


## FastgpuSDK

### Constructor

```ts
new FastgpuSDK(options?: object)
```

Create a new SDK client instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | SDK configuration options. |
| `options.apikey` | `string` | API key for authentication. |
| `options.base` | `string` | Base URL for API requests. |
| `options.prefix` | `string` | URL prefix appended after base. |
| `options.suffix` | `string` | URL suffix appended after path. |
| `options.headers` | `object` | Custom headers for all requests. |
| `options.feature` | `object` | Feature configuration. |
| `options.system` | `object` | System overrides (e.g. custom fetch). |


### Static Methods

#### `FastgpuSDK.test(testopts?, sdkopts?)`

Create a test client with mock features active.

```ts
const client = FastgpuSDK.test()
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `testopts` | `object` | Test feature options. |
| `sdkopts` | `object` | Additional SDK options merged with test defaults. |

**Returns:** `FastgpuSDK` instance in test mode.


### Instance Methods

#### `Match(data?: object)`

Create a new `Match` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `MatchEntity` instance.

#### `Price(data?: object)`

Create a new `Price` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `PriceEntity` instance.

#### `Router(data?: object)`

Create a new `Router` entity instance.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `data` | `object` | Initial entity data. |

**Returns:** `RouterEntity` instance.

#### `options()`

Return a deep copy of the current SDK options.

**Returns:** `object`

#### `utility()`

Return a copy of the SDK utility object.

**Returns:** `object`

#### `direct(fetchargs?: object)`

Make a direct HTTP request to any API endpoint.

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `fetchargs.path` | `string` | URL path with optional `{param}` placeholders. |
| `fetchargs.method` | `string` | HTTP method (default: `GET`). |
| `fetchargs.params` | `object` | Path parameter values for `{param}` substitution. |
| `fetchargs.query` | `object` | Query string parameters. |
| `fetchargs.headers` | `object` | Request headers (merged with defaults). |
| `fetchargs.body` | `any` | Request body (objects are JSON-serialized). |
| `fetchargs.ctrl` | `object` | Control options (e.g. `{ explain: true }`). |
| `fetchargs.ctrl.signal` | `AbortSignal` | Aborts the request in flight: `ok` is then `false` and `err.code` is `request_aborted`. |

**Returns:** `Promise<{ ok, status, headers, data }>`. On a failure
`ok` is `false` and `err` holds the error.

#### `prepare(fetchargs?: object)`

Prepare a fetch definition without sending the request. Accepts the
same parameters as `direct()`.

**Returns:** `Promise<{ url, method, headers, body } | Error>`

#### `tester(testopts?, sdkopts?)`

Alias for `FastgpuSDK.test()`.

**Returns:** `FastgpuSDK` instance in test mode.

#### Cancelling a call

Every entity operation takes an optional `ctrl` object after its match or
data, and an `AbortSignal` in `ctrl.signal` cancels the request in flight.
The operation then rejects with an error whose `code` is
`request_aborted` and whose `cause` is the signal's reason. A request
whose signal has already aborted is not sent. `stream()` takes the signal
as `callopts.signal`, and ends when it aborts.


---

## MatchEntity

```ts
const match = client.Match()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `billed_hours` | `number | null` | No | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `string` | No | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `number` | No |  |
| `estimated_total_usd` | `number | null` | No | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `string | null` | No | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `boolean` | No |  |
| `gpu` | `string` | No |  |
| `gpu_count` | `number` | No |  |
| `monthly_usd` | `number` | No |  |
| `offer_type` | `string` | No |  |
| `over_budget` | `boolean` | No |  |
| `page_url` | `string` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `boolean` | No |  |
| `provider` | `string` | No |  |
| `provider_label` | `string | null` | No |  |
| `quote_age_seconds` | `number | null` | No | Seconds between fetched_at and as_of. |
| `reason` | `string` | No |  |
| `reliability` | `string` | No |  |
| `score` | `number | null` | No |  |
| `tokens_per_sec` | `number | null` | No |  |
| `url` | `string` | No | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `number | null` | No |  |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Match().list({ query: "example" })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `MatchEntity` instance with the same client and
options.

#### `client()`

Return the parent `FastgpuSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## PriceEntity

```ts
const price = client.Price()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `arch` | `string | null` | No |  |
| `carried_providers` | `number` | No |  |
| `cheapest_billed_separately` | `string | null` | No |  |
| `cheapest_min_gpu_count` | `number | null` | No |  |
| `cheapest_provider` | `string | null` | No |  |
| `cheapest_usd_hr` | `number | null` | No |  |
| `degraded_providers` | `string` | No |  |
| `fixing_date` | `string` | No |  |
| `floor_availability` | `string | null` | No |  |
| `floor_billed_separately` | `string | null` | No |  |
| `floor_min_gpu_count` | `number | null` | No |  |
| `floor_offer_type` | `string | null` | No |  |
| `floor_provider` | `string | null` | No |  |
| `floor_provider_label` | `string | null` | No |  |
| `floor_usd_hr` | `number | null` | No |  |
| `gpu` | `string` | No |  |
| `gpu_model` | `string` | No |  |
| `gpu_slug` | `string` | No |  |
| `hyperscaler_median_usd_hr` | `number | null` | No |  |
| `hyperscaler_providers` | `number` | No |  |
| `in_stock_offers` | `number` | No |  |
| `method_version` | `string` | No |  |
| `offer_count` | `number` | No |  |
| `on_demand_median_usd_hr` | `number | null` | No |  |
| `on_demand_offers` | `number` | No |  |
| `on_demand_providers` | `number` | No |  |
| `page_url` | `string` | No | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `number` | No |  |
| `slug` | `string` | No |  |
| `snapshot_at` | `string` | No |  |
| `spot_floor_availability` | `string | null` | No |  |
| `spot_floor_billed_separately` | `string | null` | No |  |
| `spot_floor_min_gpu_count` | `number | null` | No |  |
| `spot_floor_provider` | `string | null` | No |  |
| `spot_floor_provider_label` | `string | null` | No |  |
| `spot_floor_usd_hr` | `number | null` | No |  |
| `spot_providers` | `number` | No |  |
| `stock_known_offers` | `number` | No |  |
| `tier` | `string | null` | No |  |
| `url` | `string` | No | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `string | null` | No |  |
| `vram_gb` | `number | null` | No |  |

### Operations

#### `list(match: object, ctrl?: object)`

List entities matching the given criteria. Resolves to an array of entities, one per record.

```ts
const results = await client.Price().list()
```

#### `load(match: object, ctrl?: object)`

Load a single entity matching the given criteria. Resolves to the entity, whose record `data()` reads.

```ts
const result = await client.Price().load()
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `PriceEntity` instance with the same client and
options.

#### `client()`

Return the parent `FastgpuSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## RouterEntity

```ts
const router = client.Router()
```

### Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No |  |

### Actions

This entity exposes custom API actions in addition to the standard
operations. Select one with `$action` in the call's argument; the
remaining keys are sent as that action's payload.

| Action | Route | Call |
| --- | --- | --- |
| `launch` | `/api/v1/router/launch` | `client.Router().create({ $action: 'launch', ... })` |

An action returns that action's OWN response, which is not necessarily a
Router record — check the API definition for its shape.

```ts
const result = await client.Router().create({
  $action: 'launch',
  /* ...the action's own arguments */
})
```

### Operations

#### `create(data: object, ctrl?: object)`

Create a new entity with the given data. Resolves to the created entity.

```ts
const result = await client.Router().create({
})
```

#### `remove(match: object, ctrl?: object)`

Remove the entity matching the given criteria. Resolves to the entity, marked as deleted.

```ts
const result = await client.Router().remove({ id: 'router_id' })
```

### Common Methods

#### `data(data?: object)`

Get or set the entity data. When called with data, sets the entity's
internal data and returns the current data. When called without
arguments, returns a copy of the current data.

#### `match(match?: object)`

Get or set the entity match criteria. Works the same as `data()`.

#### `make()`

Create a new `RouterEntity` instance with the same client and
options.

#### `client()`

Return the parent `FastgpuSDK` instance.

#### `entopts()`

Return a copy of the entity options.


---

## Features

| Feature | Version | Description |
| --- | --- | --- |
| `ratelimit` | 0.0.1 | Rate limiting |
| `retry` | 0.0.1 | Retry |
| `test` | 0.0.1 | Test transport |
| `timeout` | 0.0.1 | Timeout |


Features are activated via the `feature` option:

```ts
const client = new FastgpuSDK({
  feature: {
    ratelimit: { active: true },
    retry: { active: true },
    test: { active: true },
    timeout: { active: true },
  }
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

