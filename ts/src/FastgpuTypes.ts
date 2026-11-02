// Typed models for the Fastgpu SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Match {
  billed_hours?: number | null
  billing_increment?: string
  effective_usd_hr?: number
  estimated_total_usd?: number | null
  fetched_at?: string | null
  fits_single_card?: boolean
  gpu?: string
  gpu_count?: number
  monthly_usd?: number
  offer_type?: string
  over_budget?: boolean
  page_url?: string
  partner?: boolean
  provider?: string
  provider_label?: string | null
  quote_age_seconds?: number | null
  reason?: string
  reliability?: string
  score?: number | null
  tokens_per_sec?: number | null
  url?: string
  usd_per_million_tokens?: number | null
}

export interface MatchListMatch {
  budget_usd_hr?: number
  duration_hour?: number
  gpu_count?: number
  max_quote_age_minute?: number
  max_total_usd?: number
  min_gpu_memory_gb?: number
  model?: string
  params_b?: number
  precision?: string
  query: string
  region?: string
  reserved?: string
  spot?: string
  task?: string
  vram_gb?: number
  weights_gb?: number
}

export interface Price {
  arch?: string | null
  carried_providers?: number
  cheapest_billed_separately?: string | null
  cheapest_min_gpu_count?: number | null
  cheapest_provider?: string | null
  cheapest_usd_hr?: number | null
  degraded_providers?: string
  fixing_date?: string
  floor_availability?: string | null
  floor_billed_separately?: string | null
  floor_min_gpu_count?: number | null
  floor_offer_type?: string | null
  floor_provider?: string | null
  floor_provider_label?: string | null
  floor_usd_hr?: number | null
  gpu?: string
  gpu_model?: string
  gpu_slug?: string
  hyperscaler_median_usd_hr?: number | null
  hyperscaler_providers?: number
  in_stock_offers?: number
  method_version?: string
  offer_count?: number
  on_demand_median_usd_hr?: number | null
  on_demand_offers?: number
  on_demand_providers?: number
  page_url?: string
  provider_count?: number
  slug?: string
  snapshot_at?: string
  spot_floor_availability?: string | null
  spot_floor_billed_separately?: string | null
  spot_floor_min_gpu_count?: number | null
  spot_floor_provider?: string | null
  spot_floor_provider_label?: string | null
  spot_floor_usd_hr?: number | null
  spot_providers?: number
  stock_known_offers?: number
  tier?: string | null
  url?: string
  vendor?: string | null
  vram_gb?: number | null
}

export interface PriceLoadMatch {
  day?: number
  gpu?: string
}

export interface PriceListMatch {
  date?: string
  gpu?: string
  limit?: number
  offset?: number
}

export interface Router {
  id?: string
}

export interface RouterCreateData {
  query?: any

  // Selects a custom action instead of the plain create:
  //   'launch'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface RouterRemoveMatch {
  id: string
}

