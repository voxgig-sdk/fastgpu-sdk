-- Typed models for the Fastgpu SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
-- params (op.<name>.points[].g.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Match
---@field billed_hours? number|nil
---@field billing_increment? string
---@field effective_usd_hr? number
---@field estimated_total_usd? number|nil
---@field fetched_at? string|nil
---@field fits_single_card? boolean
---@field gpu? string
---@field gpu_count? number
---@field monthly_usd? number
---@field offer_type? string
---@field over_budget? boolean
---@field page_url? string
---@field partner? boolean
---@field provider? string
---@field provider_label? string|nil
---@field quote_age_seconds? number|nil
---@field reason? string
---@field reliability? string
---@field score? number|nil
---@field tokens_per_sec? number|nil
---@field url? string
---@field usd_per_million_tokens? number|nil

---@class MatchListMatch
---@field budget_usd_hr? number
---@field duration_hour? number
---@field gpu_count? number
---@field max_quote_age_minute? number
---@field max_total_usd? number
---@field min_gpu_memory_gb? number
---@field model? string
---@field params_b? number
---@field precision? string
---@field query string
---@field region? string
---@field reserved? string
---@field spot? string
---@field task? string
---@field vram_gb? number
---@field weights_gb? number

---@class Price
---@field arch? string|nil
---@field carried_providers? number
---@field cheapest_billed_separately? string|nil
---@field cheapest_min_gpu_count? number|nil
---@field cheapest_provider? string|nil
---@field cheapest_usd_hr? number|nil
---@field degraded_providers? string
---@field fixing_date? string
---@field floor_availability? string|nil
---@field floor_billed_separately? string|nil
---@field floor_min_gpu_count? number|nil
---@field floor_offer_type? string|nil
---@field floor_provider? string|nil
---@field floor_provider_label? string|nil
---@field floor_usd_hr? number|nil
---@field gpu? string
---@field gpu_model? string
---@field gpu_slug? string
---@field hyperscaler_median_usd_hr? number|nil
---@field hyperscaler_providers? number
---@field in_stock_offers? number
---@field method_version? string
---@field offer_count? number
---@field on_demand_median_usd_hr? number|nil
---@field on_demand_offers? number
---@field on_demand_providers? number
---@field page_url? string
---@field provider_count? number
---@field slug? string
---@field snapshot_at? string
---@field spot_floor_availability? string|nil
---@field spot_floor_billed_separately? string|nil
---@field spot_floor_min_gpu_count? number|nil
---@field spot_floor_provider? string|nil
---@field spot_floor_provider_label? string|nil
---@field spot_floor_usd_hr? number|nil
---@field spot_providers? number
---@field stock_known_offers? number
---@field tier? string|nil
---@field url? string
---@field vendor? string|nil
---@field vram_gb? number|nil

---@class PriceLoadMatch
---@field day? number
---@field gpu? string

---@class PriceListMatch
---@field date? string
---@field gpu? string
---@field limit? number
---@field offset? number

---@class Router
---@field id? string

---@class RouterCreateData
---@field query? any

---@class RouterRemoveMatch
---@field id string

local M = {}

return M
