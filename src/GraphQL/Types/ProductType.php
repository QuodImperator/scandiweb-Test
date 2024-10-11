<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use App\Model\Category;

class ProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => function() {
                return [
                    'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                    'name' => TypeRegistry::nonNull(TypeRegistry::string()),
                    'inStock' => TypeRegistry::nonNull(TypeRegistry::boolean()),
                    'gallery' => TypeRegistry::listOf(TypeRegistry::string()),
                    'description' => TypeRegistry::string(),
                    'category' => [
                        'type' => TypeRegistry::category(),
                        'resolve' => function($product) {
                            return Category::find($product['category_id']);
                        }
                    ],
                    'brand' => TypeRegistry::string(),
                    'attributes' => TypeRegistry::listOf(TypeRegistry::attribute()),
                    'prices' => TypeRegistry::listOf(TypeRegistry::price()),
                ];
            }
        ]);
    }
}