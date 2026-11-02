# Fastgpu SDK utility: prepare_body
require_relative 'media'
module FastgpuUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return FastgpuUtilities.raw_body(ctx.reqdata) if FastgpuUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
