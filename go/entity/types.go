// Typed models for the Fastgpu SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/fastgpu-sdk/go/core"
)

// Match is the typed data model for the match entity.
type Match struct {
}

// MatchListMatch is the typed request payload for Match.ListTyped.
type MatchListMatch struct {
	BudgetUsdHr *float64 `json:"budget_usd_hr,omitempty"`
	DurationHour *float64 `json:"duration_hour,omitempty"`
	GpuCount *int `json:"gpu_count,omitempty"`
	MaxQuoteAgeMinute *float64 `json:"max_quote_age_minute,omitempty"`
	MaxTotalUsd *float64 `json:"max_total_usd,omitempty"`
	MinGpuMemoryGb *int `json:"min_gpu_memory_gb,omitempty"`
	Model *string `json:"model,omitempty"`
	ParamsB *float64 `json:"params_b,omitempty"`
	Precision *string `json:"precision,omitempty"`
	Query string `json:"query"`
	Region *string `json:"region,omitempty"`
	Reserved *string `json:"reserved,omitempty"`
	Spot *string `json:"spot,omitempty"`
	Task *string `json:"task,omitempty"`
	VramGb *int `json:"vram_gb,omitempty"`
	WeightsGb *float64 `json:"weights_gb,omitempty"`
}

// Price is the typed data model for the price entity.
type Price struct {
}

// PriceLoadMatch is the typed request payload for Price.LoadTyped.
type PriceLoadMatch struct {
	Day *int `json:"day,omitempty"`
	Gpu *string `json:"gpu,omitempty"`
}

// PriceListMatch is the typed request payload for Price.ListTyped.
type PriceListMatch struct {
	Date *string `json:"date,omitempty"`
	Gpu *string `json:"gpu,omitempty"`
	Limit *int `json:"limit,omitempty"`
	Offset *int `json:"offset,omitempty"`
}

// Router is the typed data model for the router entity.
type Router struct {
}

// RouterCreateData is the typed request payload for Router.CreateTyped.
type RouterCreateData struct {
	Query *any `json:"query,omitempty"`
}

// RouterRemoveMatch is the typed request payload for Router.RemoveTyped.
type RouterRemoveMatch struct {
	Id string `json:"id"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
