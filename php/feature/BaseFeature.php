<?php
declare(strict_types=1);

// Fastgpu SDK base feature

class FastgpuBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(FastgpuContext $ctx, array $options): void {}
    public function PostConstruct(FastgpuContext $ctx): void {}
    public function PostConstructEntity(FastgpuContext $ctx): void {}
    public function SetData(FastgpuContext $ctx): void {}
    public function GetData(FastgpuContext $ctx): void {}
    public function GetMatch(FastgpuContext $ctx): void {}
    public function SetMatch(FastgpuContext $ctx): void {}
    public function PrePoint(FastgpuContext $ctx): void {}
    public function PreSpec(FastgpuContext $ctx): void {}
    public function PreRequest(FastgpuContext $ctx): void {}
    public function PreResponse(FastgpuContext $ctx): void {}
    public function PreResult(FastgpuContext $ctx): void {}
    public function PreDone(FastgpuContext $ctx): void {}
    public function PreUnexpected(FastgpuContext $ctx): void {}
}
