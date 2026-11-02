package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "Fastgpu",
			"slug": "fastgpu",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"now": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
		},
		"options": map[string]any{
			"base": "https://fastgpu.co",
			"auth": map[string]any{
				"prefix": "Bearer",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"match": map[string]any{},
				"price": map[string]any{},
				"router": map[string]any{},
			},
		},
		"entity": map[string]any{
			"match": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "billed_hours",
						"title": "Billed Hours",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
						"short": "Hours the provider bills for duration_hours: rounded up to whole hours on a per-hour meter and to whole minutes on a per-minute meter.",
					},
					map[string]any{
						"name": "billing_increment",
						"title": "Billing Increment",
						"type": "`$STRING`",
						"short": "How this provider's meter ticks for on-demand rental; varies means FastGPU has no verified figure.",
					},
					map[string]any{
						"name": "effective_usd_hr",
						"title": "Effective Usd Hr",
						"type": "`$NUMBER`",
					},
					map[string]any{
						"name": "estimated_total_usd",
						"title": "Estimated Total Usd",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
						"short": "effective_usd_hr times billed_hours, rounded up to the cent.",
					},
					map[string]any{
						"name": "fetched_at",
						"title": "Fetched At",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
						"short": "When this price was fetched from the provider (ISO 8601).",
					},
					map[string]any{
						"name": "fits_single_card",
						"title": "Fits Single Card",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "gpu",
						"title": "Gpu",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "gpu_count",
						"title": "Gpu Count",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "monthly_usd",
						"title": "Monthly Usd",
						"type": "`$NUMBER`",
					},
					map[string]any{
						"name": "offer_type",
						"title": "Offer Type",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "over_budget",
						"title": "Over Budget",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "page_url",
						"title": "Page Url",
						"type": "`$STRING`",
						"short": "Absolute URL of this GPU's live price page, with every live offer.",
					},
					map[string]any{
						"name": "partner",
						"title": "Partner",
						"type": "`$BOOLEAN`",
					},
					map[string]any{
						"name": "provider",
						"title": "Provider",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "provider_label",
						"title": "Provider Label",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "quote_age_seconds",
						"title": "Quote Age Seconds",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$INTEGER`",
								"`$NULL`",
							},
						},
						"short": "Seconds between fetched_at and as_of.",
					},
					map[string]any{
						"name": "reason",
						"title": "Reason",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "reliability",
						"title": "Reliability",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "score",
						"title": "Score",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "tokens_per_sec",
						"title": "Tokens Per Sec",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "url",
						"title": "Url",
						"type": "`$STRING`",
						"short": "Site-relative path of this GPU's live price page, e.g.",
					},
					map[string]any{
						"name": "usd_per_million_tokens",
						"title": "Usd Per Million Tokens",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
				},
				"name": "match",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/match",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "match",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"match",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "budget_usd_hr",
											"orig": "budget_usd_hr",
											"type": "`$NUMBER`",
											"kind": "query",
										},
										map[string]any{
											"name": "duration_hour",
											"orig": "duration_hours",
											"type": "`$NUMBER`",
											"kind": "query",
										},
										map[string]any{
											"name": "gpu_count",
											"orig": "gpu_count",
											"type": "`$INTEGER`",
											"kind": "query",
											"field": true,
										},
										map[string]any{
											"name": "max_quote_age_minute",
											"orig": "max_quote_age_minutes",
											"type": "`$NUMBER`",
											"kind": "query",
										},
										map[string]any{
											"name": "max_total_usd",
											"orig": "max_total_usd",
											"type": "`$NUMBER`",
											"kind": "query",
										},
										map[string]any{
											"name": "min_gpu_memory_gb",
											"orig": "min_gpu_memory_gb",
											"type": "`$INTEGER`",
											"kind": "query",
										},
										map[string]any{
											"name": "model",
											"orig": "model",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "params_b",
											"orig": "params_b",
											"type": "`$NUMBER`",
											"kind": "query",
										},
										map[string]any{
											"name": "precision",
											"orig": "precision",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "query",
											"orig": "query",
											"type": "`$STRING`",
											"kind": "query",
											"reqd": true,
											"example": "cheapest to serve Llama 3 70B",
										},
										map[string]any{
											"name": "region",
											"orig": "region",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "reserved",
											"orig": "reserved",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "spot",
											"orig": "spot",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "task",
											"orig": "task",
											"type": "`$STRING`",
											"kind": "query",
										},
										map[string]any{
											"name": "vram_gb",
											"orig": "vram_gb",
											"type": "`$INTEGER`",
											"kind": "query",
										},
										map[string]any{
											"name": "weights_gb",
											"orig": "weights_gb",
											"type": "`$NUMBER`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"query",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"price": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "arch",
						"title": "Arch",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "carried_providers",
						"title": "Carried Providers",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "cheapest_billed_separately",
						"title": "Cheapest Billed Separately",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "cheapest_min_gpu_count",
						"title": "Cheapest Min Gpu Count",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$INTEGER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "cheapest_provider",
						"title": "Cheapest Provider",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "cheapest_usd_hr",
						"title": "Cheapest Usd Hr",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "degraded_providers",
						"title": "Degraded Providers",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "fixing_date",
						"title": "Fixing Date",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "floor_availability",
						"title": "Floor Availability",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "floor_billed_separately",
						"title": "Floor Billed Separately",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "floor_min_gpu_count",
						"title": "Floor Min Gpu Count",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$INTEGER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "floor_offer_type",
						"title": "Floor Offer Type",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "floor_provider",
						"title": "Floor Provider",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "floor_provider_label",
						"title": "Floor Provider Label",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "floor_usd_hr",
						"title": "Floor Usd Hr",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "gpu",
						"title": "Gpu",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "gpu_model",
						"title": "Gpu Model",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "gpu_slug",
						"title": "Gpu Slug",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "hyperscaler_median_usd_hr",
						"title": "Hyperscaler Median Usd Hr",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "hyperscaler_providers",
						"title": "Hyperscaler Providers",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "in_stock_offers",
						"title": "In Stock Offers",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "method_version",
						"title": "Method Version",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "offer_count",
						"title": "Offer Count",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "on_demand_median_usd_hr",
						"title": "On Demand Median Usd Hr",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "on_demand_offers",
						"title": "On Demand Offers",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "on_demand_providers",
						"title": "On Demand Providers",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "page_url",
						"title": "Page Url",
						"type": "`$STRING`",
						"short": "Absolute URL of this GPU's live price page, with every live offer.",
					},
					map[string]any{
						"name": "provider_count",
						"title": "Provider Count",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "slug",
						"title": "Slug",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "snapshot_at",
						"title": "Snapshot At",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "spot_floor_availability",
						"title": "Spot Floor Availability",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "spot_floor_billed_separately",
						"title": "Spot Floor Billed Separately",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "spot_floor_min_gpu_count",
						"title": "Spot Floor Min Gpu Count",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$INTEGER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "spot_floor_provider",
						"title": "Spot Floor Provider",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "spot_floor_provider_label",
						"title": "Spot Floor Provider Label",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "spot_floor_usd_hr",
						"title": "Spot Floor Usd Hr",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "spot_providers",
						"title": "Spot Providers",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "stock_known_offers",
						"title": "Stock Known Offers",
						"type": "`$INTEGER`",
					},
					map[string]any{
						"name": "tier",
						"title": "Tier",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "url",
						"title": "Url",
						"type": "`$STRING`",
						"short": "Site-relative path of this GPU's live price page, e.g.",
					},
					map[string]any{
						"name": "vendor",
						"title": "Vendor",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$STRING`",
								"`$NULL`",
							},
						},
					},
					map[string]any{
						"name": "vram_gb",
						"title": "Vram Gb",
						"type": []any{
							"`$ONE`",
							[]any{
								"`$NUMBER`",
								"`$NULL`",
							},
						},
					},
				},
				"name": "price",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/fixings",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "fixings",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"fixings",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.fixings`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "date",
											"orig": "date",
											"type": "`$STRING`",
											"kind": "query",
											"example": "latest",
										},
										map[string]any{
											"name": "gpu",
											"orig": "gpu",
											"type": "`$STRING`",
											"kind": "query",
											"example": "h100-sxm",
											"field": true,
										},
										map[string]any{
											"name": "limit",
											"orig": "limit",
											"type": "`$INTEGER`",
											"kind": "query",
										},
										map[string]any{
											"name": "offset",
											"orig": "offset",
											"type": "`$INTEGER`",
											"kind": "query",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/gpus",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "gpus",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"gpus",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.gpus`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "tier",
											"orig": "tier",
											"type": "`$STRING`",
											"kind": "query",
											"field": true,
										},
										map[string]any{
											"name": "vendor",
											"orig": "vendor",
											"type": "`$STRING`",
											"kind": "query",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/availability",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "availability",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"availability",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "day",
											"orig": "days",
											"type": "`$INTEGER`",
											"kind": "query",
											"example": "30",
										},
										map[string]any{
											"name": "gpu",
											"orig": "gpu",
											"type": "`$STRING`",
											"kind": "query",
											"example": "b200",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/aws-capacity-blocks",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "aws-capacity-blocks",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"aws-capacity-blocks",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "gpu",
											"orig": "gpu",
											"type": "`$STRING`",
											"kind": "query",
											"example": "h100-sxm",
											"field": true,
										},
										map[string]any{
											"name": "instance_type",
											"orig": "instance_type",
											"type": "`$STRING`",
											"kind": "query",
											"example": "p5.48xlarge",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/price-changes",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "price-changes",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"price-changes",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "gpu",
											"orig": "gpu",
											"type": "`$STRING`",
											"kind": "query",
											"example": "h100-sxm",
											"field": true,
										},
										map[string]any{
											"name": "limit",
											"orig": "limit",
											"type": "`$INTEGER`",
											"kind": "query",
										},
										map[string]any{
											"name": "offset",
											"orig": "offset",
											"type": "`$INTEGER`",
											"kind": "query",
										},
										map[string]any{
											"name": "provider",
											"orig": "provider",
											"type": "`$STRING`",
											"kind": "query",
											"example": "nebius",
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/api/v1/price-risk",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "price-risk",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"price-risk",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"query": []any{
										map[string]any{
											"name": "gpu",
											"orig": "gpu",
											"type": "`$STRING`",
											"kind": "query",
											"example": "h100-sxm",
											"field": true,
										},
									},
								},
								"select": map[string]any{},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"router": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "router",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/api/v1/router/launch",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "router",
									},
									map[string]any{
										"lit": "launch",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"router",
									"launch",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.instance`",
								},
								"args": map[string]any{},
								"select": map[string]any{
									"$action": "launch",
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "DELETE",
								"orig": "/api/v1/router/instances/{id}",
								"segments": []any{
									map[string]any{
										"lit": "api",
									},
									map[string]any{
										"lit": "v1",
									},
									map[string]any{
										"lit": "router",
									},
									map[string]any{
										"lit": "instances",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"api",
									"v1",
									"router",
									"instances",
									"{id}",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.instance`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"response": map[string]any{
									"kind": "json",
									"media": "application/json",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
