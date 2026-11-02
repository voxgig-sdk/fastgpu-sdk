# Fastgpu SDK utility: make_context

from fastgpu_sdk.core.context import FastgpuContext


def make_context_util(ctxmap, basectx):
    return FastgpuContext(ctxmap, basectx)
