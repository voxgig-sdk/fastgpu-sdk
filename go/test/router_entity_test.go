package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/fastgpu-sdk/go"
	"github.com/voxgig-sdk/fastgpu-sdk/go/core"

	vs "github.com/voxgig-sdk/fastgpu-sdk/go/utility/struct"
)

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const routerEntityLiveStrict = true


func TestRouterEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Router(nil)
		if ent == nil {
			t.Fatal("expected non-nil RouterEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.Router(nil).Remove(map[string]any{"id": 1}, nil)
		if sdkerr, ok := err.(*core.FastgpuError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
		setup := routerBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "router." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		if setup.live && os.Getenv("VOXGIG_GETONLY_GUARD") == "TRUE" {
			t.Log("LIVE STEP {\"id\":\"router.create.0\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: needs POST /api/v1/router/launch\"}")
			t.Log("LIVE STEP {\"id\":\"router.remove.1\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: needs DELETE /api/v1/router/instances/{id}\"}")
			t.Skip("Live coverage incomplete: router.create.0 excluded (GET-only live run: needs POST /api/v1/router/launch); router.remove.1 excluded (GET-only live run: needs DELETE /api/v1/router/instances/{id})")
			return
		}

		client := setup.client
		_ = client

		// CREATE
		routerRef01Ent := client.Router(nil)
		routerRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "router"}), "router_ref01"))

		routerRef01DataResult, err := routerRef01Ent.Create(routerRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		routerRef01Data = core.ToMapAny(entityData(routerRef01DataResult))
		if routerRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if routerRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// REMOVE
		routerRef01MatchRm0 := map[string]any{
			"id": routerRef01Data["id"],
		}
		_, err = routerRef01Ent.Remove(routerRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

	})
}

func routerBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "router", "RouterTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read router test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse router test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap, _ := vs.Transform(
		[]any{"router01", "router02", "router03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("FASTGPU_TEST_ROUTER_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"FASTGPU_TEST_ROUTER_ENTID": idmap,
		"FASTGPU_TEST_LIVE":      "FALSE",
		"FASTGPU_TEST_EXPLAIN":   "FALSE",
		"FASTGPU_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["FASTGPU_TEST_ROUTER_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["FASTGPU_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["FASTGPU_APIKEY"],
			},
			extraOpts,
		})
		client = sdk.NewFastgpuSDK(core.ToMapAny(mergedOpts))
	}

	live := env["FASTGPU_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["FASTGPU_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
