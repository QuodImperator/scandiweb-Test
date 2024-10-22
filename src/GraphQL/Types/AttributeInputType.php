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
                'name' => TypeRegistry::nonNull(TypeRegistry::string()),
                'value' => TypeRegistry::nonNull(TypeRegistry::string()),
                'displayValue' => TypeRegistry::string()
            ],
        ]);
    }
}