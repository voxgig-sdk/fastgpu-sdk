
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { FastgpuSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = FastgpuSDK.test()
    equal(testsdk instanceof FastgpuSDK, true,
      'FastgpuSDK.test() must return a client synchronously')
  })

})
