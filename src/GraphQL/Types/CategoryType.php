<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Types\TypeRegistry;
use App\Model\Product;

class CategoryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Category',
            'fields' => function() {
                return [
                    'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                    'name' => TypeRegistry::nonNull(TypeRegistry::string()),
                    'products' => [
                        'type' => TypeRegistry::listOf(TypeRegistry::product()),
                        'resolve' => function($category) {
                            return Product::where('category_id', $category['id']);
                        }
                    ],
                ];
            }
        ]);
    }
}