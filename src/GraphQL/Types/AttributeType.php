<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;

class AttributeType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Attribute',
            'fields' => [
                'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                'name' => TypeRegistry::nonNull(TypeRegistry::string()),
                'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                'items' => TypeRegistry::listOf(TypeRegistry::attributeItem()),
            ],
        ]);
    }
}