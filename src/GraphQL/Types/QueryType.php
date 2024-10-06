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
                'category' => [
                    'type' => TypeRegistry::category(),
                    'args' => ['id' => TypeRegistry::nonNull(TypeRegistry::id())],
                    'resolve' => [$resolvers, 'getCategory'],
                ],
                'products' => [
                    'type' => TypeRegistry::listOf(TypeRegistry::product()),
                    'args' => ['categoryId' => TypeRegistry::id()],
                    'resolve' => [$resolvers, 'getProducts'],
                ],
                'product' => [
                    'type' => TypeRegistry::product(),
                    'args' => ['id' => TypeRegistry::nonNull(TypeRegistry::id())],
                    'resolve' => [$resolvers, 'getProduct'],
                ],
            ],
        ]);
    }
}