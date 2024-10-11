<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\InputObjectType;

class AttributeInputType extends InputObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'AttributeInput',
            'fields' => [
                'id' => TypeRegistry::nonNull(TypeRegistry::id()),
                'value' => TypeRegistry::nonNull(TypeRegistry::string()),
            ],
        ]);
    }
}