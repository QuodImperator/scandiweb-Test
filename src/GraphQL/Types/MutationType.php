<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Resolvers\Resolvers;

class MutationType extends ObjectType
{
    public function __construct(Resolvers $resolvers)
    {
        parent::__construct([
            'name' => 'Mutation',
            'fields' => [
                'placeOrder' => [
                    'type' => TypeRegistry::order(),
                    'args' => [
                        'items' => TypeRegistry::nonNull(TypeRegistry::listOf(
                            TypeRegistry::cartItemInput()
                        )),
                        'totalAmount' => TypeRegistry::nonNull(TypeRegistry::float()),
                        'currencyCode' => TypeRegistry::nonNull(TypeRegistry::string())
                    ],
                    'resolve' => [$resolvers, 'placeOrder']
                ]
            ]
        ]);
    }
}
