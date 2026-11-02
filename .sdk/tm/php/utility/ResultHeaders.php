<?php
declare(strict_types=1);

// Fastgpu SDK utility: result_headers

class FastgpuResultHeaders
{
    public static function call(FastgpuContext $ctx): ?FastgpuResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
