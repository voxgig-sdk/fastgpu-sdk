<?php
declare(strict_types=1);

// Fastgpu SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class FastgpuMakeContext
{
    public static function call(array $ctxmap, ?FastgpuContext $basectx): FastgpuContext
    {
        return new FastgpuContext($ctxmap, $basectx);
    }
}
