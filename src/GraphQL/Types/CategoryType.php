<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class CategoryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Category',
            'fields' => [
                'category_id' => [
                    'type' => TypeRegistry::int(),
                    'resolve' => function ($category) {
                        return (int)$category['category_id'];
                    }
                ],
                'name' => [
                    'type' => TypeRegistry::string(),
                    'resolve' => function ($category) {
                        return $category['name'];
                    }
                ]
            ]
        ]);
    }
}