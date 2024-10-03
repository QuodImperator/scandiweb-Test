<?php

namespace App\Model;

use PDO;
use InvalidArgumentException;

/**
 * CartItem Model
 * 
 * This class represents the CartItem entity and provides methods to interact with the cart_items table.
 */
class CartItem extends Model
{
    /**
     * Find a cart item by its ID
     *
     * @param int $id
     * @return array|null
     * @throws InvalidArgumentException
     */
    public static function find(int $id): ?array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("Cart item ID must be a positive integer");
        }

        $instance = new self();
        return $instance->fetch("SELECT * FROM cart_items WHERE id = :id", ['id' => $id]);
    }

    /**
     * Save a new cart item
     *
     * @param array $data
     * @return int The ID of the newly created cart item
     * @throws InvalidArgumentException
     */
    public function save(array $data): int
    {
        if (empty($data['product_id']) || empty($data['quantity']) || empty($data['attribute_values'])) {
            throw new InvalidArgumentException("Invalid cart item data");
        }

        $stmt = $this->query("
            INSERT INTO cart_items (product_id, quantity, attribute_values)
            VALUES (:product_id, :quantity, :attribute_values)
        ", [
            'product_id' => $data['product_id'],
            'quantity' => $data['quantity'],
            'attribute_values' => json_encode($data['attribute_values'])
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Update an existing cart item
     *
     * @param int $id
     * @param array $data
     * @return bool
     * @throws InvalidArgumentException
     */
    public function update(int $id, array $data): bool
    {
        if ($id <= 0 || empty($data['quantity'])) {
            throw new InvalidArgumentException("Invalid update data");
        }

        $stmt = $this->query("
            UPDATE cart_items
            SET quantity = :quantity
            WHERE id = :id
        ", [
            'id' => $id,
            'quantity' => $data['quantity']
        ]);

        return $stmt->rowCount() > 0;
    }

    /**
     * Delete a cart item
     *
     * @param int $id
     * @return bool
     * @throws InvalidArgumentException
     */
    public function delete(int $id): bool
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("Cart item ID must be a positive integer");
        }

        $stmt = $this->query("DELETE FROM cart_items WHERE id = :id", ['id' => $id]);
        return $stmt->rowCount() > 0;
    }
}