<?php

namespace App\Model\Attribute;

use App\Model\Abstract\AbstractAttribute;

class SizeAttribute extends AbstractAttribute
{
    public function getType(): string
    {
        return 'size';
    }

    public function validate($value): bool
    {
        return !empty($value) && is_string($value);
    }

    public function format($value): string
    {
        return strtoupper($value);
    }
}