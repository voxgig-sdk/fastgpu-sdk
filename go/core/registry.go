package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewMatchEntityFunc func(client *FastgpuSDK, entopts map[string]any) FastgpuEntityBase

var NewPriceEntityFunc func(client *FastgpuSDK, entopts map[string]any) FastgpuEntityBase

var NewRouterEntityFunc func(client *FastgpuSDK, entopts map[string]any) FastgpuEntityBase

