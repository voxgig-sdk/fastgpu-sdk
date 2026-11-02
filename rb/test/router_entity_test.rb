# Router entity test

require "minitest/autorun"
require "json"
require_relative "../Fastgpu_sdk"
require_relative "runner"

class RouterEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = FastgpuSDK.test(nil, nil)
    ent = testsdk.Router(nil)
    assert !ent.nil?
  end

  def test_validate
    cfg = FastgpuConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = FastgpuSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Router(nil).remove({ "id" => 1 }, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_basic_flow
    setup = router_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "remove"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "router." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    if setup[:live] && ENV["VOXGIG_GETONLY_GUARD"] == "TRUE"
      puts "LIVE STEP {\"id\":\"router.create.0\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: needs POST /api/v1/router/launch\"}"
      puts "LIVE STEP {\"id\":\"router.remove.1\",\"state\":\"excluded\",\"attempted\":false,\"reason\":\"GET-only live run: needs DELETE /api/v1/router/instances/{id}\"}"
      skip("Live coverage incomplete: router.create.0 excluded (GET-only live run: needs POST /api/v1/router/launch); router.remove.1 excluded (GET-only live run: needs DELETE /api/v1/router/instances/{id})")
    end

    client = setup[:client]

    # CREATE
    router_ref01_ent = client.Router(nil)
    router_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.router"), "router_ref01"))

    router_ref01_data_result = router_ref01_ent.create(router_ref01_data, nil)
    router_ref01_data = Helpers.to_map(router_ref01_data_result.respond_to?(:data_get) ? router_ref01_data_result.data_get : router_ref01_data_result)
    assert !router_ref01_data.nil?
    assert !router_ref01_data["id"].nil?

    # REMOVE
    router_ref01_match_rm0 = {
      "id" => router_ref01_data["id"],
    }
    router_ref01_ent.remove(router_ref01_match_rm0, nil)

  end
end

def router_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "router", "RouterTestData.json")
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = FastgpuSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["router01", "router02", "router03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["FASTGPU_TEST_ROUTER_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "FASTGPU_TEST_ROUTER_ENTID" => idmap,
    "FASTGPU_TEST_LIVE" => "FALSE",
    "FASTGPU_TEST_EXPLAIN" => "FALSE",
    "FASTGPU_APIKEY" => "",
  })

  idmap_resolved = Helpers.to_map(
    env["FASTGPU_TEST_ROUTER_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["FASTGPU_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
        "apikey" => env["FASTGPU_APIKEY"],
      },
      extra || {},
    ])
    client = FastgpuSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["FASTGPU_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["FASTGPU_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
