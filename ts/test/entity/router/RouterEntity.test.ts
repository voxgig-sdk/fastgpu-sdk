

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { FastgpuSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('RouterEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when FASTGPU_TEST_LIVE=TRUE.
  afterEach(liveDelay('FASTGPU_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = FastgpuSDK.test()
    const ent = testsdk.Router()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = FastgpuSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Router().remove({"id":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.FASTGPU_TEST_LIVE
    for (const op of ['create', 'remove']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'router.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":0}},"id":{"field":"id","name":"id"},"name":"router","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["query"],"co":{"id":"POST /api/v1/router/launch","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/api/v1/router/launch","q":{"$action":"launch"},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"router"},{"lit":"launch"}],"t":{"req":"`reqdata`","res":"`body.instance`"},"index$":0}],"key$":"create"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /api/v1/router/instances/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"DELETE","o":"/api/v1/router/instances/{id}","q":{"exist":["id"]},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"api"},{"lit":"v1"},{"lit":"router"},{"lit":"instances"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body.instance`"},"index$":0}],"key$":"remove"}},"relations":{"ancestors":[]},"key$":"router","name__orig":"router","Name":"Router","name_":"router","name-":"router","NAME":"ROUTER","index$":2}, {"active":true,"entity":"router","key$":"BasicRouterFlow","kind":"basic","name":"BasicRouterFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"router_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{"ref":"router_ref01","suffix":"_rm0"},"m":{"id":"router01"},"o":"remove","s":[],"v":[],"index$":1}]}, 'Router', {"POST /api/v1/router/launch":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"query":{"type":"string","description":"Describe the job, e.g. \"fine-tune Llama 3 8B\" or \"1x H100 for training\"."}},"required":["query"]}}}},"parameters":[]},"DELETE /api/v1/router/instances/{id}":{"protocol":"http","parameters":[{"name":"id","in":"path","required":true,"description":"id identifier","schema":{"type":"string"},"index$":0}]}}, { strict: LIVE_STRICT, t }, 'TRUE' === process.env.VOXGIG_GETONLY_GUARD ? {"router.create.0":"GET-only live run: needs POST /api/v1/router/launch","router.remove.1":"GET-only live run: needs DELETE /api/v1/router/instances/{id}"} : {})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const router_ref01_ent = client.Router()
    let router_ref01_data = setup.data.new.router['router_ref01']

    router_ref01_data = (await router_ref01_ent.create(router_ref01_data)).data()
    assert(null != router_ref01_data.id)


    // REMOVE
    const router_ref01_match_rm0: any = { id: router_ref01_data.id }
    await router_ref01_ent.remove(router_ref01_match_rm0)
  

  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/router/RouterTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = FastgpuSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['router01','router02','router03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'FASTGPU_TEST_ROUTER_ENTID': idmap,
    'FASTGPU_TEST_LIVE': 'FALSE',
    'FASTGPU_TEST_EXPLAIN': 'FALSE',
    'FASTGPU_APIKEY': '',
  })

  idmap = env['FASTGPU_TEST_ROUTER_ENTID']

  const live = 'TRUE' === env.FASTGPU_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['FASTGPU_TEST_ROUTER_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new FastgpuSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.FASTGPU_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.FASTGPU_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
