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
                'addToCart' => [
                    'type' => TypeRegistry::cartItem(),
                    'args' => [
                        'productId' => TypeRegistry::nonNull(TypeRegistry::id()),
                        'attributeValues' => TypeRegistry::listOf(TypeRegistry::attributeInput()),
                    ],
                    'resolve' => [$resolvers, 'addToCart'],
                ],
                'removeFromCart' => [
                    'type' => TypeRegistry::boolean(),
                    'args' => ['cartItemId' => TypeRegistry::nonNull(TypeRegistry::id())],
                    'resolve' => [$resolvers, 'removeFromCart'],
                ],
                'updateCartItemQuantity' => [
                    'type' => TypeRegistry::cartItem(),
                    'args' => [
                        'cartItemId' => TypeRegistry::nonNull(TypeRegistry::id()),
                        'quantity' => TypeRegistry::nonNull(TypeRegistry::int()),
                    ],
                    'resolve' => [$resolvers, 'updateCartItemQuantity'],
                ],
                'placeOrder' => [
                    'type' => TypeRegistry::order(),
                    'args' => ['cartItems' => TypeRegistry::listOf(TypeRegistry::cartItemInput())],
                    'resolve' => [$resolvers, 'placeOrder'],
                ],
            ],
        ]);
    }
}