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
                'order_item_id' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::int())
                ],
                'order_id' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::int())
                ],
                'product_id' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string())
                ],
                'product_name' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string())
                ],
                'attribute_values' => [
                    'type' => TypeRegistry::string()
                ],
                'quantity' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::int())
                ],
                'paid_amount' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::float())
                ],
                'currency_code' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string())
                ]
            ]
        ]);
    }
}