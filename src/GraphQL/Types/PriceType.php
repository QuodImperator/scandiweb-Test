<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class PriceType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Price',
            'fields' => [
                'amount' => TypeRegistry::nonNull(TypeRegistry::float()),
                'currency' => TypeRegistry::currency(),
            ],
        ]);
    }
}