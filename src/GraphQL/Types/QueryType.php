<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Resolvers\Resolvers;

class QueryType extends ObjectType
{
    public function __construct(Resolvers $resolvers)
    {
        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => TypeRegistry::listOf(TypeRegistry::category()),
                    'resolve' => [$resolvers, 'getCategories'],
                ],
                'products' => [
                    'type' => TypeRegistry::listOf(TypeRegistry::product()),
                    'args' => [
                        'categoryId' => TypeRegistry::string(),
                    ],
                    'resolve' => [$resolvers, 'getProducts'],
                ],
                'product' => [
                    'type' => TypeRegistry::product(),
                    'args' => [
                        'id' => TypeRegistry::nonNull(TypeRegistry::string()),
                    ],
                    'resolve' => [$resolvers, 'getProduct'],
                ],
            ],
        ]);
    }
}