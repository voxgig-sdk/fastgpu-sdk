package voxgigfastgpusdk

import (
	"github.com/voxgig-sdk/fastgpu-sdk/go/core"
	"github.com/voxgig-sdk/fastgpu-sdk/go/entity"
	"github.com/voxgig-sdk/fastgpu-sdk/go/feature"
	_ "github.com/voxgig-sdk/fastgpu-sdk/go/utility"
)

// Type aliases preserve external API.
type FastgpuSDK = core.FastgpuSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type FastgpuEntityBase = core.FastgpuEntityBase

// Deprecated: use FastgpuEntityBase.
type FastgpuEntity = core.FastgpuEntityBase

type StreamItem = core.StreamItem
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type FastgpuError = core.FastgpuError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewRatelimitFeatureFunc = func() core.Feature {
		return feature.NewRatelimitFeature()
	}
	core.NewRetryFeatureFunc = func() core.Feature {
		return feature.NewRetryFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewTimeoutFeatureFunc = func() core.Feature {
		return feature.NewTimeoutFeature()
	}
	core.NewMatchEntityFunc = func(client *core.FastgpuSDK, entopts map[string]any) core.FastgpuEntityBase {
		return entity.NewMatchEntity(client, entopts)
	}
	core.NewPriceEntityFunc = func(client *core.FastgpuSDK, entopts map[string]any) core.FastgpuEntityBase {
		return entity.NewPriceEntity(client, entopts)
	}
	core.NewRouterEntityFunc = func(client *core.FastgpuSDK, entopts map[string]any) core.FastgpuEntityBase {
		return entity.NewRouterEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewFastgpuSDK = core.NewFastgpuSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var SharedConfig = core.SharedConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewFastgpuSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *FastgpuSDK  { return NewFastgpuSDK(nil) }
func Test() *FastgpuSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewRatelimitFeature = feature.NewRatelimitFeature
var NewRetryFeature = feature.NewRetryFeature
var NewTestFeature = feature.NewTestFeature
var NewTimeoutFeature = feature.NewTimeoutFeature
