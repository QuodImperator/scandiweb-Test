<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class OrderType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Order',
            'fields' => [
                'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                'items' => TypeRegistry::listOf(TypeRegistry::orderItem()),
                'total' => TypeRegistry::nonNull(TypeRegistry::price()),
                'status' => TypeRegistry::nonNull(TypeRegistry::orderStatus()),
            ],
        ]);
    }
}