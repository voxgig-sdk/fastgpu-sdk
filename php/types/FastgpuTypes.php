<?php
declare(strict_types=1);

// Typed models for the Fastgpu SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Match entity data model. */
class MatchType
{
    public mixed $billed_hours = null;
    public ?string $billing_increment = null;
    public ?float $effective_usd_hr = null;
    public mixed $estimated_total_usd = null;
    public mixed $fetched_at = null;
    public ?bool $fits_single_card = null;
    public ?string $gpu = null;
    public ?int $gpu_count = null;
    public ?float $monthly_usd = null;
    public ?string $offer_type = null;
    public ?bool $over_budget = null;
    public ?string $page_url = null;
    public ?bool $partner = null;
    public ?string $provider = null;
    public mixed $provider_label = null;
    public mixed $quote_age_seconds = null;
    public ?string $reason = null;
    public ?string $reliability = null;
    public mixed $score = null;
    public mixed $tokens_per_sec = null;
    public ?string $url = null;
    public mixed $usd_per_million_tokens = null;
}

/** Request payload for Match#list. */
class MatchListMatch
{
    public ?float $budget_usd_hr = null;
    public ?float $duration_hour = null;
    public ?int $gpu_count = null;
    public ?float $max_quote_age_minute = null;
    public ?float $max_total_usd = null;
    public ?int $min_gpu_memory_gb = null;
    public ?string $model = null;
    public ?float $params_b = null;
    public ?string $precision = null;
    public string $query;
    public ?string $region = null;
    public ?string $reserved = null;
    public ?string $spot = null;
    public ?string $task = null;
    public ?int $vram_gb = null;
    public ?float $weights_gb = null;
}

/** Price entity data model. */
class Price
{
    public mixed $arch = null;
    public ?int $carried_providers = null;
    public mixed $cheapest_billed_separately = null;
    public mixed $cheapest_min_gpu_count = null;
    public mixed $cheapest_provider = null;
    public mixed $cheapest_usd_hr = null;
    public ?string $degraded_providers = null;
    public ?string $fixing_date = null;
    public mixed $floor_availability = null;
    public mixed $floor_billed_separately = null;
    public mixed $floor_min_gpu_count = null;
    public mixed $floor_offer_type = null;
    public mixed $floor_provider = null;
    public mixed $floor_provider_label = null;
    public mixed $floor_usd_hr = null;
    public ?string $gpu = null;
    public ?string $gpu_model = null;
    public ?string $gpu_slug = null;
    public mixed $hyperscaler_median_usd_hr = null;
    public ?int $hyperscaler_providers = null;
    public ?int $in_stock_offers = null;
    public ?string $method_version = null;
    public ?int $offer_count = null;
    public mixed $on_demand_median_usd_hr = null;
    public ?int $on_demand_offers = null;
    public ?int $on_demand_providers = null;
    public ?string $page_url = null;
    public ?int $provider_count = null;
    public ?string $slug = null;
    public ?string $snapshot_at = null;
    public mixed $spot_floor_availability = null;
    public mixed $spot_floor_billed_separately = null;
    public mixed $spot_floor_min_gpu_count = null;
    public mixed $spot_floor_provider = null;
    public mixed $spot_floor_provider_label = null;
    public mixed $spot_floor_usd_hr = null;
    public ?int $spot_providers = null;
    public ?int $stock_known_offers = null;
    public mixed $tier = null;
    public ?string $url = null;
    public mixed $vendor = null;
    public mixed $vram_gb = null;
}

/** Request payload for Price#load. */
class PriceLoadMatch
{
    public ?int $day = null;
    public ?string $gpu = null;
}

/** Request payload for Price#list. */
class PriceListMatch
{
    public ?string $date = null;
    public ?string $gpu = null;
    public ?int $limit = null;
    public ?int $offset = null;
}

/** Router entity data model. */
class Router
{
    public ?string $id = null;
}

/** Request payload for Router#create. */
class RouterCreateData
{
    public mixed $query = null;
}

/** Request payload for Router#remove. */
class RouterRemoveMatch
{
    public string $id;
}

