# Fastgpu SDK exists test

require "minitest/autorun"
require_relative "../Fastgpu_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = FastgpuSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
