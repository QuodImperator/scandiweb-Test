<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class CurrencyType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Currency',
            'fields' => [
                'symbol' => TypeRegistry::string(),
            ],
        ]);
    }
}