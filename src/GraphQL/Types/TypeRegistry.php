<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\EnumType;
use App\GraphQL\Types\AttributeItemType;
use App\GraphQL\Types\AttributeInputType;
use App\GraphQL\Types\CategoryType;
use App\GraphQL\Types\ProductType;
use App\GraphQL\Types\CartItemType;
use App\GraphQL\Types\OrderType;
use App\GraphQL\Types\AttributeType;
use App\GraphQL\Types\PriceType;
use App\GraphQL\Types\OrderItemType;
use App\GraphQL\Types\CurrencyType;
use App\GraphQL\Types\CartItemInputType;

class TypeRegistry
{
    private static $types = [];

    public static function string()
    {
        return Type::string();
    }

    public static function int()
    {
        return Type::int();
    }

    public static function float()
    {
        return Type::float();
    }

    public static function boolean()
    {
        return Type::boolean();
    }

    public static function id()
    {
        return Type::id();
    }

    public static function nonNull($type)
    {
        return Type::nonNull($type);
    }

    public static function listOf($type)
    {
        return Type::listOf($type);
    }

    public static function category()
    {
        return self::$types['category'] ??= new CategoryType();
    }

    public static function product()
    {
        return self::$types['product'] ??= new ProductType();
    }

    public static function cartItem()
    {
        return self::$types['cartItem'] ??= new CartItemType();
    }

    public static function order()
    {
        return self::$types['order'] ??= new OrderType();
    }

    public static function attribute()
    {
        return self::$types['attribute'] ??= new AttributeType();
    }

    public static function attributeItem()
    {
        return self::$types['attributeItem'] ??= new AttributeItemType();
    }

    public static function attributeInput()
    {
        return self::$types['attributeInput'] ??= new AttributeInputType();
    }

    public static function price()
    {
        return self::$types['price'] ??= new PriceType();
    }

    public static function orderItem()
    {
        return self::$types['orderItem'] ??= new OrderItemType();
    }

    public static function currency()
    {
        return self::$types['currency'] ??= new CurrencyType();
    }

    public static function orderStatus()
    {
        return self::$types['orderStatus'] ??= new EnumType([
            'name' => 'OrderStatus',
            'values' => [
                'PENDING' => ['value' => 'PENDING'],
                'PROCESSING' => ['value' => 'PROCESSING'],
                'SHIPPED' => ['value' => 'SHIPPED'],
                'DELIVERED' => ['value' => 'DELIVERED'],
            ],
        ]);
    }

    public static function cartItemInput()
    {
        return self::$types['cartItemInput'] ??= new CartItemInputType();
    }
}