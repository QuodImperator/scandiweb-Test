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
                    'type' => TypeRegistry::nonNull(TypeRegistry::id()),
                    'resolve' => function ($category) {
                        error_log('Resolving id for category: ' . json_encode($category));
                        try {
                            return (string)$category['category_id'];
                        } catch (\Exception $e) {
                            error_log('Error resolving category id: ' . $e->getMessage());
                            throw $e;
                        }
                    }
                ],
                'name' => [
                    'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                    'resolve' => function ($category) {
                        error_log('Resolving name for category: ' . json_encode($category));
                        try {
                            return $category['name'];
                        } catch (\Exception $e) {
                            error_log('Error resolving category name: ' . $e->getMessage());
                            throw $e;
                        }
                    }
                ]
            ]
        ]);
    }
}