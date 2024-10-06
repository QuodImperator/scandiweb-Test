<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class CategoryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Category',
            'fields' => [
                'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                'name' => TypeRegistry::nonNull(TypeRegistry::string()),
                'products' => TypeRegistry::listOf(TypeRegistry::product()),
            ],
        ]);
    }
}