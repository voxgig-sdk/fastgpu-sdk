# Fastgpu SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'graphql'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

FastgpuUtility.registrar = ->(u) {
  u.clean = FastgpuUtilities::Clean
  u.clean_add = FastgpuUtilities::CleanAdd
  u.clean_explain = FastgpuUtilities::CleanExplain
  u.done = FastgpuUtilities::Done
  u.make_error = FastgpuUtilities::MakeError
  u.feature_add = FastgpuUtilities::FeatureAdd
  u.feature_hook = FastgpuUtilities::FeatureHook
  u.feature_init = FastgpuUtilities::FeatureInit
  u.fetcher = FastgpuUtilities::Fetcher
  u.make_fetch_def = FastgpuUtilities::MakeFetchDef
  u.make_context = FastgpuUtilities::MakeContext
  u.make_options = FastgpuUtilities::MakeOptions
  u.make_request = FastgpuUtilities::MakeRequest
  u.make_response = FastgpuUtilities::MakeResponse
  u.make_result = FastgpuUtilities::MakeResult
  u.make_point = FastgpuUtilities::MakePoint
  u.make_spec = FastgpuUtilities::MakeSpec
  u.make_url = FastgpuUtilities::MakeUrl
  u.param = FastgpuUtilities::Param
  u.prepare_auth = FastgpuUtilities::PrepareAuth
  u.prepare_body = FastgpuUtilities::PrepareBody
  u.prepare_headers = FastgpuUtilities::PrepareHeaders
  u.prepare_method = FastgpuUtilities::PrepareMethod
  u.prepare_params = FastgpuUtilities::PrepareParams
  u.prepare_path = FastgpuUtilities::PreparePath
  u.prepare_query = FastgpuUtilities::PrepareQuery
  u.graphql_body = FastgpuUtilities::GraphqlBody
  u.graphql_errors = FastgpuUtilities::GraphqlErrors
  u.result_basic = FastgpuUtilities::ResultBasic
  u.result_body = FastgpuUtilities::ResultBody
  u.result_headers = FastgpuUtilities::ResultHeaders
  u.transform_request = FastgpuUtilities::TransformRequest
  u.transform_response = FastgpuUtilities::TransformResponse
}
