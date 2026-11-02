# Fastgpu SDK configuration

module FastgpuConfig
  # Return the process-wide config, built once on first use. The SDK reads
  # the config on every request and never writes to it, so one instance is
  # shared by every client rather than rebuilt per client.
  #
  # The returned hash is shared: treat it as read-only. Callers that need to
  # mutate should use make_config, which always returns a fresh copy.
  def self.shared_config
    @shared_config ||= make_config
  end


  # Build a fresh, fully materialised config hash. Every call rebuilds the
  # whole structure, so prefer shared_config unless you need a private copy
  # you intend to mutate.
  def self.make_config
    {
      "main" => {
        "name" => "Fastgpu",
        "slug" => "fastgpu",
        "version" => "0.0.1",
        "target" => "rb",
      },
      "feature" => {
        "ratelimit" => {
          "options" => {
            "active" => false,
            "burst" => 5,
            "rate" => 5,
          },
          "optspec" => {
            "now" => "`$FUNCTION`",
            "sleep" => "`$FUNCTION`",
          },
          "strict" => false,
          "transport" => "wrap",
        },
        "retry" => {
          "options" => {
            "active" => false,
            "factor" => 2,
            "maxDelay" => 2000,
            "minDelay" => 50,
            "retries" => 2,
            "statuses" => [
              408,
              425,
              429,
              500,
              502,
              503,
              504,
            ],
          },
          "optspec" => {
            "jitter" => "`$BOOLEAN`",
            "sleep" => "`$FUNCTION`",
          },
          "strict" => false,
          "transport" => "wrap",
        },
        "test" => {
          "options" => {
            "active" => false,
          },
          "optspec" => {
            "entity" => "`$MAP`",
            "net" => "`$MAP`",
          },
          "strict" => false,
          "transport" => "base",
        },
        "timeout" => {
          "options" => {
            "active" => false,
            "ms" => 30000,
          },
          "optspec" => {
            "clearTimer" => "`$FUNCTION`",
            "now" => "`$FUNCTION`",
            "setTimer" => "`$FUNCTION`",
          },
          "strict" => false,
          "transport" => "wrap",
        },
      },
      "options" => {
        "base" => "https://fastgpu.co",
        "auth" => {
          "prefix" => "Bearer",
        },
        "headers" => {
          "content-type" => "application/json",
        },
        "entity" => {
          "match" => {},
          "price" => {},
          "router" => {},
        },
      },
      "entity" => {
        "match" => {
          "fields" => [
            {
              "name" => "billed_hours",
              "title" => "Billed Hours",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
              "short" => "Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter.",
            },
            {
              "name" => "billing_increment",
              "title" => "Billing Increment",
              "type" => "`$STRING`",
              "short" => "How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure.",
            },
            {
              "name" => "effective_usd_hr",
              "title" => "Effective Usd Hr",
              "type" => "`$NUMBER`",
            },
            {
              "name" => "estimated_total_usd",
              "title" => "Estimated Total Usd",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
              "short" => "effective_usd_hr times billed_hours, rounded up to the cent.",
            },
            {
              "name" => "fetched_at",
              "title" => "Fetched At",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
              "short" => "When this price was fetched from the provider (ISO 8601).",
            },
            {
              "name" => "fits_single_card",
              "title" => "Fits Single Card",
              "type" => "`$BOOLEAN`",
            },
            {
              "name" => "gpu",
              "title" => "Gpu",
              "type" => "`$STRING`",
            },
            {
              "name" => "gpu_count",
              "title" => "Gpu Count",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "monthly_usd",
              "title" => "Monthly Usd",
              "type" => "`$NUMBER`",
            },
            {
              "name" => "offer_type",
              "title" => "Offer Type",
              "type" => "`$STRING`",
            },
            {
              "name" => "over_budget",
              "title" => "Over Budget",
              "type" => "`$BOOLEAN`",
            },
            {
              "name" => "page_url",
              "title" => "Page Url",
              "type" => "`$STRING`",
              "short" => "Absolute URL of this GPU's live price page, with every live offer.",
            },
            {
              "name" => "partner",
              "title" => "Partner",
              "type" => "`$BOOLEAN`",
            },
            {
              "name" => "provider",
              "title" => "Provider",
              "type" => "`$STRING`",
            },
            {
              "name" => "provider_label",
              "title" => "Provider Label",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "quote_age_seconds",
              "title" => "Quote Age Seconds",
              "type" => [
                "`$ONE`",
                [
                  "`$INTEGER`",
                  "`$NULL`",
                ],
              ],
              "short" => "Seconds between fetched_at and as_of.",
            },
            {
              "name" => "reason",
              "title" => "Reason",
              "type" => "`$STRING`",
            },
            {
              "name" => "reliability",
              "title" => "Reliability",
              "type" => "`$STRING`",
            },
            {
              "name" => "score",
              "title" => "Score",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "tokens_per_sec",
              "title" => "Tokens Per Sec",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "url",
              "title" => "Url",
              "type" => "`$STRING`",
              "short" => "Site-relative path of this GPU's live price page, e.g.",
            },
            {
              "name" => "usd_per_million_tokens",
              "title" => "Usd Per Million Tokens",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
          ],
          "name" => "match",
          "op" => {
            "list" => {
              "input" => "data",
              "name" => "list",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/match",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "match",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "match",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "budget_usd_hr",
                        "orig" => "budget_usd_hr",
                        "type" => "`$NUMBER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "duration_hour",
                        "orig" => "duration_hours",
                        "type" => "`$NUMBER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "gpu_count",
                        "orig" => "gpu_count",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                        "field" => true,
                      },
                      {
                        "name" => "max_quote_age_minute",
                        "orig" => "max_quote_age_minutes",
                        "type" => "`$NUMBER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "max_total_usd",
                        "orig" => "max_total_usd",
                        "type" => "`$NUMBER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "min_gpu_memory_gb",
                        "orig" => "min_gpu_memory_gb",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "model",
                        "orig" => "model",
                        "type" => "`$STRING`",
                        "kind" => "query",
                      },
                      {
                        "name" => "params_b",
                        "orig" => "params_b",
                        "type" => "`$NUMBER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "precision",
                        "orig" => "precision",
                        "type" => "`$STRING`",
                        "kind" => "query",
                      },
                      {
                        "name" => "query",
                        "orig" => "query",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "reqd" => true,
                        "example" => "cheapest to serve Llama 3 70B",
                      },
                      {
                        "name" => "region",
                        "orig" => "region",
                        "type" => "`$STRING`",
                        "kind" => "query",
                      },
                      {
                        "name" => "reserved",
                        "orig" => "reserved",
                        "type" => "`$STRING`",
                        "kind" => "query",
                      },
                      {
                        "name" => "spot",
                        "orig" => "spot",
                        "type" => "`$STRING`",
                        "kind" => "query",
                      },
                      {
                        "name" => "task",
                        "orig" => "task",
                        "type" => "`$STRING`",
                        "kind" => "query",
                      },
                      {
                        "name" => "vram_gb",
                        "orig" => "vram_gb",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "weights_gb",
                        "orig" => "weights_gb",
                        "type" => "`$NUMBER`",
                        "kind" => "query",
                      },
                    ],
                  },
                  "select" => {
                    "exist" => [
                      "query",
                    ],
                  },
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
        "price" => {
          "fields" => [
            {
              "name" => "arch",
              "title" => "Arch",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "carried_providers",
              "title" => "Carried Providers",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "cheapest_billed_separately",
              "title" => "Cheapest Billed Separately",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "cheapest_min_gpu_count",
              "title" => "Cheapest Min Gpu Count",
              "type" => [
                "`$ONE`",
                [
                  "`$INTEGER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "cheapest_provider",
              "title" => "Cheapest Provider",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "cheapest_usd_hr",
              "title" => "Cheapest Usd Hr",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "degraded_providers",
              "title" => "Degraded Providers",
              "type" => "`$STRING`",
            },
            {
              "name" => "fixing_date",
              "title" => "Fixing Date",
              "type" => "`$STRING`",
            },
            {
              "name" => "floor_availability",
              "title" => "Floor Availability",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "floor_billed_separately",
              "title" => "Floor Billed Separately",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "floor_min_gpu_count",
              "title" => "Floor Min Gpu Count",
              "type" => [
                "`$ONE`",
                [
                  "`$INTEGER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "floor_offer_type",
              "title" => "Floor Offer Type",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "floor_provider",
              "title" => "Floor Provider",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "floor_provider_label",
              "title" => "Floor Provider Label",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "floor_usd_hr",
              "title" => "Floor Usd Hr",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "gpu",
              "title" => "Gpu",
              "type" => "`$STRING`",
            },
            {
              "name" => "gpu_model",
              "title" => "Gpu Model",
              "type" => "`$STRING`",
            },
            {
              "name" => "gpu_slug",
              "title" => "Gpu Slug",
              "type" => "`$STRING`",
            },
            {
              "name" => "hyperscaler_median_usd_hr",
              "title" => "Hyperscaler Median Usd Hr",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "hyperscaler_providers",
              "title" => "Hyperscaler Providers",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "in_stock_offers",
              "title" => "In Stock Offers",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "method_version",
              "title" => "Method Version",
              "type" => "`$STRING`",
            },
            {
              "name" => "offer_count",
              "title" => "Offer Count",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "on_demand_median_usd_hr",
              "title" => "On Demand Median Usd Hr",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "on_demand_offers",
              "title" => "On Demand Offers",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "on_demand_providers",
              "title" => "On Demand Providers",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "page_url",
              "title" => "Page Url",
              "type" => "`$STRING`",
              "short" => "Absolute URL of this GPU's live price page, with every live offer.",
            },
            {
              "name" => "provider_count",
              "title" => "Provider Count",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "slug",
              "title" => "Slug",
              "type" => "`$STRING`",
            },
            {
              "name" => "snapshot_at",
              "title" => "Snapshot At",
              "type" => "`$STRING`",
            },
            {
              "name" => "spot_floor_availability",
              "title" => "Spot Floor Availability",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "spot_floor_billed_separately",
              "title" => "Spot Floor Billed Separately",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "spot_floor_min_gpu_count",
              "title" => "Spot Floor Min Gpu Count",
              "type" => [
                "`$ONE`",
                [
                  "`$INTEGER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "spot_floor_provider",
              "title" => "Spot Floor Provider",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "spot_floor_provider_label",
              "title" => "Spot Floor Provider Label",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "spot_floor_usd_hr",
              "title" => "Spot Floor Usd Hr",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "spot_providers",
              "title" => "Spot Providers",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "stock_known_offers",
              "title" => "Stock Known Offers",
              "type" => "`$INTEGER`",
            },
            {
              "name" => "tier",
              "title" => "Tier",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "url",
              "title" => "Url",
              "type" => "`$STRING`",
              "short" => "Site-relative path of this GPU's live price page, e.g.",
            },
            {
              "name" => "vendor",
              "title" => "Vendor",
              "type" => [
                "`$ONE`",
                [
                  "`$STRING`",
                  "`$NULL`",
                ],
              ],
            },
            {
              "name" => "vram_gb",
              "title" => "Vram Gb",
              "type" => [
                "`$ONE`",
                [
                  "`$NUMBER`",
                  "`$NULL`",
                ],
              ],
            },
          ],
          "name" => "price",
          "op" => {
            "list" => {
              "input" => "data",
              "name" => "list",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/fixings",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "fixings",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "fixings",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.fixings`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "date",
                        "orig" => "date",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "latest",
                      },
                      {
                        "name" => "gpu",
                        "orig" => "gpu",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "h100-sxm",
                        "field" => true,
                      },
                      {
                        "name" => "limit",
                        "orig" => "limit",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "offset",
                        "orig" => "offset",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/gpus",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "gpus",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "gpus",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.gpus`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "tier",
                        "orig" => "tier",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "field" => true,
                      },
                      {
                        "name" => "vendor",
                        "orig" => "vendor",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "field" => true,
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
            "load" => {
              "input" => "data",
              "name" => "load",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/availability",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "availability",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "availability",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "day",
                        "orig" => "days",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                        "example" => "30",
                      },
                      {
                        "name" => "gpu",
                        "orig" => "gpu",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "b200",
                        "field" => true,
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/aws-capacity-blocks",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "aws-capacity-blocks",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "aws-capacity-blocks",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "gpu",
                        "orig" => "gpu",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "h100-sxm",
                        "field" => true,
                      },
                      {
                        "name" => "instance_type",
                        "orig" => "instance_type",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "p5.48xlarge",
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/price-changes",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "price-changes",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "price-changes",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "gpu",
                        "orig" => "gpu",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "h100-sxm",
                        "field" => true,
                      },
                      {
                        "name" => "limit",
                        "orig" => "limit",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "offset",
                        "orig" => "offset",
                        "type" => "`$INTEGER`",
                        "kind" => "query",
                      },
                      {
                        "name" => "provider",
                        "orig" => "provider",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "nebius",
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
                {
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/api/v1/price-risk",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "price-risk",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "price-risk",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                  "args" => {
                    "query" => [
                      {
                        "name" => "gpu",
                        "orig" => "gpu",
                        "type" => "`$STRING`",
                        "kind" => "query",
                        "example" => "h100-sxm",
                        "field" => true,
                      },
                    ],
                  },
                  "select" => {},
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
        "router" => {
          "fields" => [
            {
              "name" => "id",
              "title" => "Id",
              "type" => "`$STRING`",
            },
          ],
          "id" => {
            "field" => "id",
            "name" => "id",
          },
          "name" => "router",
          "op" => {
            "create" => {
              "input" => "data",
              "name" => "create",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "POST",
                  "orig" => "/api/v1/router/launch",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "router",
                    },
                    {
                      "lit" => "launch",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "router",
                    "launch",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.instance`",
                  },
                  "args" => {},
                  "select" => {
                    "$action" => "launch",
                  },
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
            "remove" => {
              "input" => "data",
              "name" => "remove",
              "points" => [
                {
                  "kind" => "http",
                  "method" => "DELETE",
                  "orig" => "/api/v1/router/instances/{id}",
                  "segments" => [
                    {
                      "lit" => "api",
                    },
                    {
                      "lit" => "v1",
                    },
                    {
                      "lit" => "router",
                    },
                    {
                      "lit" => "instances",
                    },
                    {
                      "var" => "id",
                    },
                  ],
                  "parts" => [
                    "api",
                    "v1",
                    "router",
                    "instances",
                    "{id}",
                  ],
                  "rename" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.instance`",
                  },
                  "args" => {
                    "params" => [
                      {
                        "name" => "id",
                        "orig" => "id",
                        "type" => "`$STRING`",
                        "kind" => "param",
                        "reqd" => true,
                      },
                    ],
                  },
                  "select" => {
                    "exist" => [
                      "id",
                    ],
                  },
                  "response" => {
                    "kind" => "json",
                    "media" => "application/json",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
      },
    }
  end


  def self.make_feature(name)
    require_relative 'features'
    FastgpuFeatures.make_feature(name)
  end
end
