# FastGPU API

> Live GPU cloud price comparison across the whole market, as a REST API and MCP server. FastGPU brokers GPU capacity: describe the cluster you need and get competing quotes from capacity holders, each shown next to live prices from RunPod, Vast.ai, Lambda, the hyperscalers and more. Free for buyers, no sales calls. The GET /api/v1/router/instances/&#123;id&#125; operation was removed because it needs a FastGPU API key (401 without one). 2 GET operations that require a key or session were removed on 2026-10-23.
>
> `query` on GET /api/v1/match is marked required: the API answers 400 without a query or structured fields (verified 2026-10-25).

## Start here

This guide introduces the API, the client libraries, and the companion tools in this repository. Start with the API capabilities, choose a client for your application, and use the linked reference when you need exact request and response details.

The selected API surface contains 3 entities and 9 HTTP routes. There are 6 SDK targets and 2 companion tools.

An entity groups related API operations. An operation can have several routes with different inputs or authentication requirements. The SDK exposes the entity and its operations using the conventions of the selected language.

## What the API provides

### Match

Results: Success.

SDK operations: `list`.

Key fields to recognise:

- `billed_hours`: Hours the provider bills for `duration_hours`: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter. Null when `duration_hours` was not sent.
- `billing_increment`: How this provider&#39;s meter ticks for on-demand rental; varies means FastGPU has no verified figure.
- `estimated_total_usd`: `effective_usd_hr` times `billed_hours`, rounded up to the cent. GPU rental only: storage, data transfer, CPU and memory billed separately, and provider minimums are not included. Null when `duration_hours` was not sent.
- `fetched_at`: When this price was fetched from the provider (ISO 8601).
- `page_url`: Absolute URL of this GPU&#39;s live price page, with every live offer.

### Price

Results: Success.

SDK operations: `list`, `load`.

Key fields to recognise:

- `page_url`: Absolute URL of this GPU&#39;s live price page, with every live offer.
- `url`: Site-relative path of this GPU&#39;s live price page, for example /gpus/h100-sxm.

### Router

Results: Success.

SDK operations: `create`, `remove`.

### Route map

Use this map to locate a capability. Consult the entity reference before supplying request data; routes for the same operation can require different fields.

| Entity | SDK operation | HTTP route | Authentication |
| --- | --- | --- | --- |
| Match | `list` | `GET /api/v1/match` | See reference |
| Price | `list` | `GET /api/v1/fixings` | See reference |
| Price | `list` | `GET /api/v1/gpus` | See reference |
| Price | `load` | `GET /api/v1/availability` | See reference |
| Price | `load` | `GET /api/v1/aws-capacity-blocks` | See reference |
| Price | `load` | `GET /api/v1/price-changes` | See reference |
| Price | `load` | `GET /api/v1/price-risk` | See reference |
| Router | `create` | `POST /api/v1/router/launch` | Required |
| Router | `remove` | `DELETE /api/v1/router/instances/{id}` | Required |

## Connect to the API

- API server: `https://fastgpu.co`

The default credential is sent in the `Authorization` header with the `Bearer` prefix.

FastGPU API key (`fgpu_live_`...), sent as an Authorization: Bearer header. Create one at /app.

Check authentication for the route you plan to call. A route that declares no authentication can be used without credentials; this does not change the requirements of other routes. Keep credentials in environment variables or a configured secret provider, and keep them out of source control and logs.

## Make a first request

1. Choose the API server and an operation that matches your task.
2. Check the operation’s required input and authentication. Use values valid for your account and environment.
3. Send one request and inspect the returned data before adding retries, concurrency, or a larger batch.

For an SDK call, install or build the chosen client, create a client instance with its documented configuration, and call the required entity operation. Language references describe the argument shape, asynchronous behaviour, and returned values.

## Choose an SDK

Choose the language already used by your application or service. The clients represent the same API model, while package setup, naming, and return types follow each language. Check the selected client’s reference and tests before integrating it into an existing application.

| Client | Repository directory | Distribution |
| --- | --- | --- |
| Golang | `go/` | Build from source |
| Lua | `lua/` | Build from source |
| PHP | `php/` | Build from source |
| Python | `py/` | Build from source |
| Ruby | `rb/` | Build from source |
| TypeScript | `ts/` | Build from source |

Build-from-source entries are not marked as published in the project model. Follow the build instructions in that target’s README, then consume the resulting package using your language’s local dependency mechanism. Published entries give the installation command recorded for that client.

## Companion tools

These targets provide another way to use the API. Their available commands or tools can cover a smaller set of operations than the client libraries.

### Go CLI

Use the command-line interface for shell-based tasks and scripts.

Repository directory: `go-cli/`. Not published. Build from the go-cli directory.


### Go MCP server

Use the MCP server to expose supported API operations to an MCP client.

Repository directory: `go-mcp/`. Not published. Build from the go-mcp directory.

- `fastgpu_list`: List records for an entity. Supported entities: `match`, `price`.
- `fastgpu_load`: Load one record for an entity. Supported entities: `price`.

## Operational features

Features supply behaviour around API calls, such as request handling, diagnostics, or local testing. Inclusion in this project does not mean a feature is enabled at runtime. Check the selected SDK’s supported features and configuration defaults, then enable the behaviour your application needs.

- `ratelimit`: Client-side rate limiting via a token bucket
- `retry`: Automatic retry of transient failures with exponential backoff
- `test`: In-memory mock transport for testing without a live server
- `timeout`: Per-request timeout with transport abort

Start with the default client configuration. Add request limits and diagnostics as needed, test error paths, and review retry behaviour before using operations that change data. A retry can repeat an operation unless the API provides a suitable guarantee.

## Continue with the documentation

- Follow the first-call guide for the setup sequence.
- Read the authentication guide before using protected routes.
- Use the API reference for request schemas, response formats, and status codes.
- Check the chosen SDK or companion tool reference for its configuration and supported operations.

