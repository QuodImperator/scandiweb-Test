<?php

namespace App\Model\Abstract;

abstract class AbstractAttribute extends AbstractModel
{
    abstract public function getType(): string;
    abstract public function validate($value): bool;
    abstract public function format($value): string;
}