<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use App\GraphQL\Types\TypeRegistry;

class CategoryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Category',
            'fields' => function() {
                return [
                    'id' => [
                        'type' => TypeRegistry::nonNull(TypeRegistry::id()),
                        'resolve' => function ($category) {
                            return (string)$category['category_id'];
                        }
                    ],
                    'name' => [
                        'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                        'resolve' => function ($category) {
                            return $category['name'];
                        }
                    ],
                ];
            }
        ]);
    }
}