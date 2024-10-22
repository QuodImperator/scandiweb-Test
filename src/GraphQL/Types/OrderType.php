<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use App\Model\Order;

class OrderType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Order',
            'fields' => [
                'order_id' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::int()),
                ],
                'total_amount' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::float()),
                ],
                'currency_code' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                ],
                'status' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                ],
                'created_at' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                ],
                'updated_at' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                ]
            ],
        ]);
    }
}