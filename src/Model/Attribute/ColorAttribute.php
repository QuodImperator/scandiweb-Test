<?php

namespace App\Model\Attribute;

use App\Model\Abstract\AbstractAttribute;

class ColorAttribute extends AbstractAttribute
{
    public function getType(): string
    {
        return 'color';
    }

    public function validate($value): bool
    {
        return !empty($value) && preg_match('/^#[a-fA-F0-9]{6}$/', $value);
    }

    public function format($value): string
    {
        return strtolower($value);
    }
}