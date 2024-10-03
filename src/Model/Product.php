<?php

namespace App\Model;

use PDO;
use InvalidArgumentException;

/**
 * Product Model
 * 
 * This class represents the Product entity and provides methods to interact with the products table.
 */
class Product extends Model
{
    /**
     * Retrieve all products
     *
     * @return array
     */
    public static function all(): array
    {
        $instance = new self();
        return $instance->fetchAll("SELECT * FROM products");
    }

    /**
     * Find a product by its ID
     *
     * @param string $id
     * @return array|null
     * @throws InvalidArgumentException
     */
    public static function find(string $id): ?array
    {
        if (empty($id)) {
            throw new InvalidArgumentException("Product ID cannot be empty");
        }

        $instance = new self();
        return $instance->fetch("SELECT * FROM products WHERE product_id = :id", ['id' => $id]);
    }

    /**
     * Find products by a specific column value
     *
     * @param string $column
     * @param mixed $value
     * @return array
     * @throws InvalidArgumentException
     */
    public static function where(string $column, $value): array
    {
        if (empty($column)) {
            throw new InvalidArgumentException("Column name cannot be empty");
        }

        $instance = new self();
        return $instance->fetchAll("SELECT * FROM products WHERE $column = :value", ['value' => $value]);
    }

    /**
     * Get attributes for a product
     *
     * @param string $productId
     * @return array
     */
    public function attributes(string $productId): array
    {
        return $this->fetchAll("
            SELECT a.*, pa.display_value, pa.value
            FROM attributes a
            JOIN product_attributes pa ON a.attribute_id = pa.attribute_id
            WHERE pa.product_id = :product_id
        ", ['product_id' => $productId]);
    }

    /**
     * Get prices for a product
     *
     * @param string $productId
     * @return array
     */
    public function prices(string $productId): array
    {
        return $this->fetchAll("
            SELECT p.*, c.label, c.symbol
            FROM prices p
            JOIN currencies c ON p.currency_code = c.currency_code
            WHERE p.product_id = :product_id
        ", ['product_id' => $productId]);
    }
}