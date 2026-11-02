# Fastgpu TypeScript SDK



The TypeScript SDK for the Fastgpu API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Match()` — each with a small set of operations (`list`, `load`, `create`, `remove`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.

> Also generated from this model: `go`, `go-cli`, `go-mcp`, `lua`, `php`, `py`, `rb` — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Tags](https://github.com/voxgig-sdk/fastgpu-sdk/tags)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/voxgig-sdk/fastgpu-sdk
npm install ./fastgpu-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { FastgpuSDK } from '@voxgig-sdk/fastgpu-sdk'

const client = new FastgpuSDK({
  apikey: process.env.FASTGPU_APIKEY,
})
```

### 2. List match records

`list()` resolves to an array of Match ENTITIES — every operation
resolves to entities, not raw records. Iterate them directly, and call
`.data()` on one for the record it holds:

```ts
const matchs = await client.Match().list({ query: "example" })

for (const match of matchs) {
  console.log(match.data())
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const matchs = await client.Match().list({ query: "example" })
  console.log(matchs.map((item) => item.data()))
} catch (err) {
  console.error('list failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
result envelope. Branch on `ok`; on failure `status` holds the HTTP status
(for error responses) and `err` holds the error:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (!result.ok) {
  console.error('request failed:', result.status, result.err)
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = FastgpuSDK.test()

const matchs = await client.Match().list({ query: 'example_query' })
// matchs is an array of Match entities, one per mock record
console.log(matchs.map((match) => match.data()))
```

You can also use the instance method:

```ts
const client = new FastgpuSDK({ apikey: '...' })
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Match()

// First call runs the operation and stores its result
await entity.list({ query: 'example_query' })

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new FastgpuSDK({
  apikey: '...',
  extend: [logger],
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
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### FastgpuSDK

#### Constructor

```ts
new FastgpuSDK(options?: {
  apikey?: string
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `apikey` | `string` | API key for authentication. |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Match(data?)` | `MatchEntity` | Create a Match entity instance. |
| `Price(data?)` | `PriceEntity` | Create a Price entity instance. |
| `Router(data?)` | `RouterEntity` | Create a Router entity instance. |
| `tester(testopts?, sdkopts?)` | `FastgpuSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `FastgpuSDK.test(testopts?, sdkopts?)` | `FastgpuSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria, and return it. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria, one per record. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity, and return it. |
| `remove` | `remove(reqmatch?, ctrl?): Promise<Entity>` | Remove an entity, and return it marked as deleted. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): FastgpuSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity itself — there is no result
envelope, and an entity's `data()` reads its record:

- `load` and `create` resolve to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).
- `remove` resolves to the entity, marked as deleted.

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

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

Operations: list.

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

Operations: list, load.

API path: `/api/v1/fixings`

#### Router

| Field | Description |
| --- | --- |
| `id` |  |

Operations: create, remove.

API path: `/api/v1/router/launch`



## Entities


### Match

Create an instance: `const match = client.Match()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `billed_hours` | `number | null` | Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. |
| `billing_increment` | `string` | How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure. |
| `effective_usd_hr` | `number` |  |
| `estimated_total_usd` | `number | null` | effective_usd_hr times billed_hours, rounded up to the cent. |
| `fetched_at` | `string | null` | When this price was fetched from the provider (ISO 8601). |
| `fits_single_card` | `boolean` |  |
| `gpu` | `string` |  |
| `gpu_count` | `number` |  |
| `monthly_usd` | `number` |  |
| `offer_type` | `string` |  |
| `over_budget` | `boolean` |  |
| `page_url` | `string` | Absolute URL of this GPU's live price page, with every live offer. |
| `partner` | `boolean` |  |
| `provider` | `string` |  |
| `provider_label` | `string | null` |  |
| `quote_age_seconds` | `number | null` | Seconds between fetched_at and as_of. |
| `reason` | `string` |  |
| `reliability` | `string` |  |
| `score` | `number | null` |  |
| `tokens_per_sec` | `number | null` |  |
| `url` | `string` | Site-relative path of this GPU's live price page, e.g. |
| `usd_per_million_tokens` | `number | null` |  |

#### Example: List

```ts
const matchs = await client.Match().list({ query: "example" })
```


### Price

Create an instance: `const price = client.Price()`

#### Operations

| Method | Description |
| --- | --- |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `arch` | `string | null` |  |
| `carried_providers` | `number` |  |
| `cheapest_billed_separately` | `string | null` |  |
| `cheapest_min_gpu_count` | `number | null` |  |
| `cheapest_provider` | `string | null` |  |
| `cheapest_usd_hr` | `number | null` |  |
| `degraded_providers` | `string` |  |
| `fixing_date` | `string` |  |
| `floor_availability` | `string | null` |  |
| `floor_billed_separately` | `string | null` |  |
| `floor_min_gpu_count` | `number | null` |  |
| `floor_offer_type` | `string | null` |  |
| `floor_provider` | `string | null` |  |
| `floor_provider_label` | `string | null` |  |
| `floor_usd_hr` | `number | null` |  |
| `gpu` | `string` |  |
| `gpu_model` | `string` |  |
| `gpu_slug` | `string` |  |
| `hyperscaler_median_usd_hr` | `number | null` |  |
| `hyperscaler_providers` | `number` |  |
| `in_stock_offers` | `number` |  |
| `method_version` | `string` |  |
| `offer_count` | `number` |  |
| `on_demand_median_usd_hr` | `number | null` |  |
| `on_demand_offers` | `number` |  |
| `on_demand_providers` | `number` |  |
| `page_url` | `string` | Absolute URL of this GPU's live price page, with every live offer. |
| `provider_count` | `number` |  |
| `slug` | `string` |  |
| `snapshot_at` | `string` |  |
| `spot_floor_availability` | `string | null` |  |
| `spot_floor_billed_separately` | `string | null` |  |
| `spot_floor_min_gpu_count` | `number | null` |  |
| `spot_floor_provider` | `string | null` |  |
| `spot_floor_provider_label` | `string | null` |  |
| `spot_floor_usd_hr` | `number | null` |  |
| `spot_providers` | `number` |  |
| `stock_known_offers` | `number` |  |
| `tier` | `string | null` |  |
| `url` | `string` | Site-relative path of this GPU's live price page, e.g. |
| `vendor` | `string | null` |  |
| `vram_gb` | `number | null` |  |

#### Example: Load

```ts
const price = await client.Price().load()
```

#### Example: List

```ts
const prices = await client.Price().list()
```


### Router

Create an instance: `const router = client.Router()`

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

```ts
const router = await client.Router().create({
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

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **RatelimitFeature**: Rate limiting
- **RetryFeature**: Retry
- **TestFeature**: Test transport
- **TimeoutFeature**: Timeout

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
fastgpu/
├── src/
│   ├── FastgpuSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { FastgpuSDK } from '@voxgig-sdk/fastgpu-sdk'
```

### Entity state

Entity instances are stateful. After a successful `list`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const match = client.Match()
await match.list({ query: "example" })

// match.data() now returns the match data from the last `list`
// match.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
