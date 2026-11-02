# frozen_string_literal: true

# Typed models for the Fastgpu SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Match entity data model.
#
# @!attribute [rw] billed_hours
#   @return [Object, nil]
#
# @!attribute [rw] billing_increment
#   @return [String, nil]
#
# @!attribute [rw] effective_usd_hr
#   @return [Float, nil]
#
# @!attribute [rw] estimated_total_usd
#   @return [Object, nil]
#
# @!attribute [rw] fetched_at
#   @return [Object, nil]
#
# @!attribute [rw] fits_single_card
#   @return [Boolean, nil]
#
# @!attribute [rw] gpu
#   @return [String, nil]
#
# @!attribute [rw] gpu_count
#   @return [Integer, nil]
#
# @!attribute [rw] monthly_usd
#   @return [Float, nil]
#
# @!attribute [rw] offer_type
#   @return [String, nil]
#
# @!attribute [rw] over_budget
#   @return [Boolean, nil]
#
# @!attribute [rw] page_url
#   @return [String, nil]
#
# @!attribute [rw] partner
#   @return [Boolean, nil]
#
# @!attribute [rw] provider
#   @return [String, nil]
#
# @!attribute [rw] provider_label
#   @return [Object, nil]
#
# @!attribute [rw] quote_age_seconds
#   @return [Object, nil]
#
# @!attribute [rw] reason
#   @return [String, nil]
#
# @!attribute [rw] reliability
#   @return [String, nil]
#
# @!attribute [rw] score
#   @return [Object, nil]
#
# @!attribute [rw] tokens_per_sec
#   @return [Object, nil]
#
# @!attribute [rw] url
#   @return [String, nil]
#
# @!attribute [rw] usd_per_million_tokens
#   @return [Object, nil]
Match = Struct.new(
  :billed_hours,
  :billing_increment,
  :effective_usd_hr,
  :estimated_total_usd,
  :fetched_at,
  :fits_single_card,
  :gpu,
  :gpu_count,
  :monthly_usd,
  :offer_type,
  :over_budget,
  :page_url,
  :partner,
  :provider,
  :provider_label,
  :quote_age_seconds,
  :reason,
  :reliability,
  :score,
  :tokens_per_sec,
  :url,
  :usd_per_million_tokens,
  keyword_init: true
)

# Request payload for Match#list.
#
# @!attribute [rw] budget_usd_hr
#   @return [Float, nil]
#
# @!attribute [rw] duration_hour
#   @return [Float, nil]
#
# @!attribute [rw] gpu_count
#   @return [Integer, nil]
#
# @!attribute [rw] max_quote_age_minute
#   @return [Float, nil]
#
# @!attribute [rw] max_total_usd
#   @return [Float, nil]
#
# @!attribute [rw] min_gpu_memory_gb
#   @return [Integer, nil]
#
# @!attribute [rw] model
#   @return [String, nil]
#
# @!attribute [rw] params_b
#   @return [Float, nil]
#
# @!attribute [rw] precision
#   @return [String, nil]
#
# @!attribute [rw] query
#   @return [String]
#
# @!attribute [rw] region
#   @return [String, nil]
#
# @!attribute [rw] reserved
#   @return [String, nil]
#
# @!attribute [rw] spot
#   @return [String, nil]
#
# @!attribute [rw] task
#   @return [String, nil]
#
# @!attribute [rw] vram_gb
#   @return [Integer, nil]
#
# @!attribute [rw] weights_gb
#   @return [Float, nil]
MatchListMatch = Struct.new(
  :budget_usd_hr,
  :duration_hour,
  :gpu_count,
  :max_quote_age_minute,
  :max_total_usd,
  :min_gpu_memory_gb,
  :model,
  :params_b,
  :precision,
  :query,
  :region,
  :reserved,
  :spot,
  :task,
  :vram_gb,
  :weights_gb,
  keyword_init: true
)

# Price entity data model.
#
# @!attribute [rw] arch
#   @return [Object, nil]
#
# @!attribute [rw] carried_providers
#   @return [Integer, nil]
#
# @!attribute [rw] cheapest_billed_separately
#   @return [Object, nil]
#
# @!attribute [rw] cheapest_min_gpu_count
#   @return [Object, nil]
#
# @!attribute [rw] cheapest_provider
#   @return [Object, nil]
#
# @!attribute [rw] cheapest_usd_hr
#   @return [Object, nil]
#
# @!attribute [rw] degraded_providers
#   @return [String, nil]
#
# @!attribute [rw] fixing_date
#   @return [String, nil]
#
# @!attribute [rw] floor_availability
#   @return [Object, nil]
#
# @!attribute [rw] floor_billed_separately
#   @return [Object, nil]
#
# @!attribute [rw] floor_min_gpu_count
#   @return [Object, nil]
#
# @!attribute [rw] floor_offer_type
#   @return [Object, nil]
#
# @!attribute [rw] floor_provider
#   @return [Object, nil]
#
# @!attribute [rw] floor_provider_label
#   @return [Object, nil]
#
# @!attribute [rw] floor_usd_hr
#   @return [Object, nil]
#
# @!attribute [rw] gpu
#   @return [String, nil]
#
# @!attribute [rw] gpu_model
#   @return [String, nil]
#
# @!attribute [rw] gpu_slug
#   @return [String, nil]
#
# @!attribute [rw] hyperscaler_median_usd_hr
#   @return [Object, nil]
#
# @!attribute [rw] hyperscaler_providers
#   @return [Integer, nil]
#
# @!attribute [rw] in_stock_offers
#   @return [Integer, nil]
#
# @!attribute [rw] method_version
#   @return [String, nil]
#
# @!attribute [rw] offer_count
#   @return [Integer, nil]
#
# @!attribute [rw] on_demand_median_usd_hr
#   @return [Object, nil]
#
# @!attribute [rw] on_demand_offers
#   @return [Integer, nil]
#
# @!attribute [rw] on_demand_providers
#   @return [Integer, nil]
#
# @!attribute [rw] page_url
#   @return [String, nil]
#
# @!attribute [rw] provider_count
#   @return [Integer, nil]
#
# @!attribute [rw] slug
#   @return [String, nil]
#
# @!attribute [rw] snapshot_at
#   @return [String, nil]
#
# @!attribute [rw] spot_floor_availability
#   @return [Object, nil]
#
# @!attribute [rw] spot_floor_billed_separately
#   @return [Object, nil]
#
# @!attribute [rw] spot_floor_min_gpu_count
#   @return [Object, nil]
#
# @!attribute [rw] spot_floor_provider
#   @return [Object, nil]
#
# @!attribute [rw] spot_floor_provider_label
#   @return [Object, nil]
#
# @!attribute [rw] spot_floor_usd_hr
#   @return [Object, nil]
#
# @!attribute [rw] spot_providers
#   @return [Integer, nil]
#
# @!attribute [rw] stock_known_offers
#   @return [Integer, nil]
#
# @!attribute [rw] tier
#   @return [Object, nil]
#
# @!attribute [rw] url
#   @return [String, nil]
#
# @!attribute [rw] vendor
#   @return [Object, nil]
#
# @!attribute [rw] vram_gb
#   @return [Object, nil]
Price = Struct.new(
  :arch,
  :carried_providers,
  :cheapest_billed_separately,
  :cheapest_min_gpu_count,
  :cheapest_provider,
  :cheapest_usd_hr,
  :degraded_providers,
  :fixing_date,
  :floor_availability,
  :floor_billed_separately,
  :floor_min_gpu_count,
  :floor_offer_type,
  :floor_provider,
  :floor_provider_label,
  :floor_usd_hr,
  :gpu,
  :gpu_model,
  :gpu_slug,
  :hyperscaler_median_usd_hr,
  :hyperscaler_providers,
  :in_stock_offers,
  :method_version,
  :offer_count,
  :on_demand_median_usd_hr,
  :on_demand_offers,
  :on_demand_providers,
  :page_url,
  :provider_count,
  :slug,
  :snapshot_at,
  :spot_floor_availability,
  :spot_floor_billed_separately,
  :spot_floor_min_gpu_count,
  :spot_floor_provider,
  :spot_floor_provider_label,
  :spot_floor_usd_hr,
  :spot_providers,
  :stock_known_offers,
  :tier,
  :url,
  :vendor,
  :vram_gb,
  keyword_init: true
)

# Request payload for Price#load.
#
# @!attribute [rw] day
#   @return [Integer, nil]
#
# @!attribute [rw] gpu
#   @return [String, nil]
PriceLoadMatch = Struct.new(
  :day,
  :gpu,
  keyword_init: true
)

# Request payload for Price#list.
#
# @!attribute [rw] date
#   @return [String, nil]
#
# @!attribute [rw] gpu
#   @return [String, nil]
#
# @!attribute [rw] limit
#   @return [Integer, nil]
#
# @!attribute [rw] offset
#   @return [Integer, nil]
PriceListMatch = Struct.new(
  :date,
  :gpu,
  :limit,
  :offset,
  keyword_init: true
)

# Router entity data model.
#
# @!attribute [rw] id
#   @return [String, nil]
Router = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Router#create.
#
# @!attribute [rw] query
#   @return [Object, nil]
RouterCreateData = Struct.new(
  :query,
  keyword_init: true
)

# Request payload for Router#remove.
#
# @!attribute [rw] id
#   @return [String]
RouterRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

