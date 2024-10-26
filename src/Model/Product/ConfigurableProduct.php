<?php

namespace App\Model\Product;

use App\Model\Abstract\AbstractProduct;

class ConfigurableProduct extends AbstractProduct
{
    private $attributesCache = null;

    public function hasAttributes(): bool
    {
        if (empty($this->productId)) {
            return false;
        }

        $result = $this->fetch(
            "SELECT COUNT(*) as count FROM product_attributes WHERE product_id = :product_id",
            ['product_id' => $this->productId]
        );

        return !empty($result) && $result['count'] > 0;
    }

    public function getPrice(): array
    {
        if (empty($this->productId)) {
            return [];
        }

        $prices = $this->fetchAll("
            SELECT p.amount, c.symbol, c.currency_code as label
            FROM prices p
            JOIN currencies c ON p.currency_code = c.currency_code
            WHERE p.product_id = :product_id
        ", ['product_id' => $this->productId]);

        return array_map(function($price) {
            return [
                'amount' => number_format($price['amount'], 2),
                'symbol' => $price['symbol'],
                'label' => $price['label']
            ];
        }, $prices);
    }

    public function getAttributes(): array
    {
        if ($this->attributesCache !== null) {
            return $this->attributesCache;
        }

        if (empty($this->productId)) {
            return [];
        }

        error_log("Getting attributes for product: {$this->productId}");

        $attributes = $this->fetchAll("
            SELECT 
                a.attribute_id,
                a.name,
                a.type,
                GROUP_CONCAT(DISTINCT pa.display_value) as display_values,
                GROUP_CONCAT(DISTINCT pa.value) as values_list
            FROM product_attributes pa
            JOIN attributes a ON a.attribute_id = pa.attribute_id
            WHERE pa.product_id = :product_id
            GROUP BY a.attribute_id, a.name, a.type
        ", ['product_id' => $this->productId]);

        error_log("Raw attributes data: " . json_encode($attributes));

        $groupedAttributes = [];
        foreach ($attributes as $attr) {
            $displayValues = explode(',', $attr['display_values']);
            $values = explode(',', $attr['values_list']);
            
            $items = [];
            for ($i = 0; $i < count($values); $i++) {
                $items[] = [
                    'id' => $values[$i],
                    'displayValue' => $displayValues[$i],
                    'value' => $values[$i]
                ];
            }

            $groupedAttributes[] = [
                'id' => $attr['attribute_id'],
                'name' => $attr['name'],
                'type' => $attr['type'],
                'items' => $items
            ];
        }

        error_log("Grouped attributes: " . json_encode($groupedAttributes));
        $this->attributesCache = $groupedAttributes;
        return $groupedAttributes;
    }

    public function isInStock(): bool
    {
        return $this->inStock && $this->hasAvailableOptions();
    }

    private function hasAvailableOptions(): bool
    {
        return count($this->getAttributes()) > 0;
    }
}