# Typed models for the Fastgpu SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
# params (op.<name>.points[].g.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Match(TypedDict, total=False):
    billed_hours: float | None
    billing_increment: str
    effective_usd_hr: float
    estimated_total_usd: float | None
    fetched_at: str | None
    fits_single_card: bool
    gpu: str
    gpu_count: int
    monthly_usd: float
    offer_type: str
    over_budget: bool
    page_url: str
    partner: bool
    provider: str
    provider_label: str | None
    quote_age_seconds: int | None
    reason: str
    reliability: str
    score: float | None
    tokens_per_sec: float | None
    url: str
    usd_per_million_tokens: float | None


class MatchListMatchRequired(TypedDict):
    query: str


class MatchListMatch(MatchListMatchRequired, total=False):
    budget_usd_hr: float
    duration_hour: float
    gpu_count: int
    max_quote_age_minute: float
    max_total_usd: float
    min_gpu_memory_gb: int
    model: str
    params_b: float
    precision: str
    region: str
    reserved: str
    spot: str
    task: str
    vram_gb: int
    weights_gb: float


class Price(TypedDict, total=False):
    arch: str | None
    carried_providers: int
    cheapest_billed_separately: str | None
    cheapest_min_gpu_count: int | None
    cheapest_provider: str | None
    cheapest_usd_hr: float | None
    degraded_providers: str
    fixing_date: str
    floor_availability: str | None
    floor_billed_separately: str | None
    floor_min_gpu_count: int | None
    floor_offer_type: str | None
    floor_provider: str | None
    floor_provider_label: str | None
    floor_usd_hr: float | None
    gpu: str
    gpu_model: str
    gpu_slug: str
    hyperscaler_median_usd_hr: float | None
    hyperscaler_providers: int
    in_stock_offers: int
    method_version: str
    offer_count: int
    on_demand_median_usd_hr: float | None
    on_demand_offers: int
    on_demand_providers: int
    page_url: str
    provider_count: int
    slug: str
    snapshot_at: str
    spot_floor_availability: str | None
    spot_floor_billed_separately: str | None
    spot_floor_min_gpu_count: int | None
    spot_floor_provider: str | None
    spot_floor_provider_label: str | None
    spot_floor_usd_hr: float | None
    spot_providers: int
    stock_known_offers: int
    tier: str | None
    url: str
    vendor: str | None
    vram_gb: float | None


class PriceLoadMatch(TypedDict, total=False):
    day: int
    gpu: str


class PriceListMatch(TypedDict, total=False):
    date: str
    gpu: str
    limit: int
    offset: int


class Router(TypedDict, total=False):
    id: str


class RouterCreateData(TypedDict, total=False):
    query: Any


class RouterRemoveMatch(TypedDict):
    id: str
