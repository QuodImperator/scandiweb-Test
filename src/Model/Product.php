<?php

namespace App\Model;

use PDO;
use InvalidArgumentException;

class Product extends Model
{
    public static function find(string $id): ?array
    {
        if (empty($id)) {
            throw new InvalidArgumentException("Product ID cannot be empty");
        }

        $instance = new self();
        $product = $instance->fetch("SELECT * FROM products WHERE product_id = :id", ['id' => $id]);
        
        if ($product) {
            $product['prices'] = self::prices($id);
            $product['attributes'] = $instance->attributes($id);
            $product['category'] = Category::find($product['category_id']);
        }
        
        return $product;
    }

    public function attributes(string $productId): array
    {
        $attributes = $this->fetchAll("
            SELECT a.attribute_id, a.name, a.type, pa.display_value, pa.value
            FROM attributes a
            JOIN product_attributes pa ON a.attribute_id = pa.attribute_id
            WHERE pa.product_id = :product_id
        ", ['product_id' => $productId]);

        $groupedAttributes = [];
        foreach ($attributes as $attr) {
            if (!isset($groupedAttributes[$attr['attribute_id']])) {
                $groupedAttributes[$attr['attribute_id']] = [
                    'id' => $attr['attribute_id'],
                    'name' => $attr['name'],
                    'type' => $attr['type'],
                    'items' => []
                ];
            }
            $groupedAttributes[$attr['attribute_id']]['items'][] = [
                'displayValue' => $attr['display_value'],
                'value' => $attr['value'],
                'id' => $attr['value'] // Assuming the value can be used as an id
            ];
        }

        return array_values($groupedAttributes);
    }

    public static function prices($productId)
    {
        $instance = new self();
        return $instance->fetchAll("
            SELECT p.amount, c.symbol, c.currency_code as label
            FROM prices p
            JOIN currencies c ON p.currency_code = c.currency_code
            WHERE p.product_id = :product_id
        ", ['product_id' => $productId]);
    }

    public static function getProductsWithPrices($categoryId = null)
    {
        $instance = new self();
        $query = "
            SELECT p.*, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
        ";
        
        $params = [];
        if ($categoryId !== null) {
            $query .= " WHERE p.category_id = :category_id";
            $params['category_id'] = $categoryId;
        }
        
        $products = $instance->fetchAll($query, $params);
        
        foreach ($products as &$product) {
            $product['prices'] = self::prices($product['product_id']);
            $product['attributes'] = $instance->attributes($product['product_id']);
            $product['category'] = ['name' => $product['category_name']];
            unset($product['category_name']);
        }
        
        return $products;
    }
}