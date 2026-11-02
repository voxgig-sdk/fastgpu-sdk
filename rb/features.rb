# Fastgpu SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module FastgpuFeatures
  def self.make_feature(name)
    case name
    when "base"
      FastgpuBaseFeature.new
    when "ratelimit"
      FastgpuRatelimitFeature.new
    when "retry"
      FastgpuRetryFeature.new
    when "test"
      FastgpuTestFeature.new
    when "timeout"
      FastgpuTimeoutFeature.new
    else
      FastgpuBaseFeature.new
    end
  end
end
