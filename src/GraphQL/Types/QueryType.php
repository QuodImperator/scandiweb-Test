<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Resolvers\Resolvers;
use App\GraphQL\Types\TypeRegistry;

class QueryType extends ObjectType
{
    public function __construct(Resolvers $resolvers)
    {
        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => TypeRegistry::listOf(TypeRegistry::category()),
                    'resolve' => function () use ($resolvers) {
                        error_log('Entering categories resolver');
                        try {
                            $result = $resolvers->getCategories();
                            error_log('Categories resolver result: ' . json_encode($result));
                            return $result;
                        } catch (\Exception $e) {
                            error_log('Exception in categories resolver: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
                            throw $e;
                        }
                    },
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
