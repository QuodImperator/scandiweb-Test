<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class CartItemType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'CartItem',
            'fields' => [
                'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                'product' => TypeRegistry::nonNull(TypeRegistry::product()),
                'quantity' => TypeRegistry::nonNull(TypeRegistry::int()),
                'attributeValues' => TypeRegistry::listOf(TypeRegistry::attributeItem()),
            ],
        ]);
    }
}