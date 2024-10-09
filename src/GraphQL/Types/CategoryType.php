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
            'fields' => [
                'id' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::int()),
                    'resolve' => function ($category) {
                        error_log('Resolving id for category: ' . json_encode($category));
                        return isset($category['id']) ? (int)$category['id'] : null;
                    }
                ],
                'name' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                    'resolve' => function ($category) {
                        error_log('Resolving name for category: ' . json_encode($category));
                        return $category['name'] ?? '';
                    }
                ]
            ]
        ]);
    }
}