<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class AttributeItemType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'AttributeItem',
            'fields' => [
                'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                'displayValue' => TypeRegistry::nonNull(TypeRegistry::string()),
                'value' => TypeRegistry::nonNull(TypeRegistry::string()),
            ],
        ]);
    }
}