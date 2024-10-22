<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\InputObjectType;

class CartItemInputType extends InputObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'CartItemInput',
            'fields' => [
                'productId' => TypeRegistry::nonNull(TypeRegistry::string()),
                'quantity' => TypeRegistry::nonNull(TypeRegistry::int()),
                'attributeValues' => TypeRegistry::listOf(TypeRegistry::attributeInput())
            ],
        ]);
    }
}