<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class OrderItemType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'OrderItem',
            'fields' => [
                'product' => TypeRegistry::nonNull(TypeRegistry::product()),
                'quantity' => TypeRegistry::nonNull(TypeRegistry::int()),
                'attributeValues' => TypeRegistry::listOf(TypeRegistry::attributeItem()),
                'price' => TypeRegistry::nonNull(TypeRegistry::price()),
            ],
        ]);
    }
}