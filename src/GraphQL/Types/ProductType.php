<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class ProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => [
                'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                'name' => TypeRegistry::nonNull(TypeRegistry::string()),
                'inStock' => TypeRegistry::nonNull(TypeRegistry::boolean()),
                'gallery' => TypeRegistry::listOf(TypeRegistry::string()),
                'description' => TypeRegistry::string(),
                'category' => TypeRegistry::category(),
                'brand' => TypeRegistry::string(),
                'attributes' => TypeRegistry::listOf(TypeRegistry::attribute()),
                'prices' => TypeRegistry::listOf(TypeRegistry::price()),
            ],
        ]);
    }
}