<?php

namespace App\Model;

class Attribute extends Model
{
    public static function getByProductId($productId)
    {
        $instance = new self();
        $attributes = $instance->fetchAll("
            SELECT a.attribute_id, a.name, a.type, pa.display_value, pa.value
            FROM attributes a
            JOIN product_attributes pa ON a.attribute_id = pa.attribute_id
            WHERE pa.product_id = :product_id
        ", ['product_id' => $productId]);

        $groupedAttributes = [];
        foreach ($attributes as $attr) {
            if (!isset($groupedAttributes[$attr['attribute_id']])) {
                $groupedAttributes[$attr['attribute_id']] = [
                    'id' => (string)$attr['attribute_id'], // Ensure id is a string
                    'name' => $attr['name'],
                    'type' => $attr['type'],
                    'items' => []
                ];
            }
            $groupedAttributes[$attr['attribute_id']]['items'][] = [
                'id' => $attr['value'], // Use value as id, which is already a string
                'displayValue' => $attr['display_value'],
                'value' => $attr['value']
            ];
        }

        return array_values($groupedAttributes);
    }
}