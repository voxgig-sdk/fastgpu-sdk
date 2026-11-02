# Fastgpu SDK feature factory

from fastgpu_sdk.feature.base_feature import FastgpuBaseFeature
from fastgpu_sdk.feature.ratelimit_feature import FastgpuRatelimitFeature
from fastgpu_sdk.feature.retry_feature import FastgpuRetryFeature
from fastgpu_sdk.feature.test_feature import FastgpuTestFeature
from fastgpu_sdk.feature.timeout_feature import FastgpuTimeoutFeature


_FEATURES = {
    "base": lambda: FastgpuBaseFeature(),
    "ratelimit": lambda: FastgpuRatelimitFeature(),
    "retry": lambda: FastgpuRetryFeature(),
    "test": lambda: FastgpuTestFeature(),
    "timeout": lambda: FastgpuTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
