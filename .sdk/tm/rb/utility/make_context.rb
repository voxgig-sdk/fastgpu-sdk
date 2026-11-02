# Fastgpu SDK utility: make_context
require_relative '../core/context'
module FastgpuUtilities
  MakeContext = ->(ctxmap, basectx) {
    FastgpuContext.new(ctxmap, basectx)
  }
end
