# Fastgpu SDK exists test

import pytest
from fastgpu_sdk import FastgpuSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = FastgpuSDK.test(None, None)
        assert testsdk is not None
