<?php

namespace App\Model;

use PDO;
use InvalidArgumentException;
use Exception;

/**
 * Order Model
 * 
 * This class represents the Order entity and provides methods to interact with the orders table.
 */
class Order extends Model
{
    /**
     * Find an order by its ID
     *
     * @param int $id
     * @return array|null
     * @throws InvalidArgumentException
     */
    public static function find(int $id): ?array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("Order ID must be a positive integer");
        }

        $instance = new self();
        return $instance->fetch("SELECT * FROM orders WHERE order_id = :id", ['id' => $id]);
    }

    /**
     * Save a new order
     *
     * @param array $data
     * @return int The ID of the newly created order
     * @throws InvalidArgumentException|Exception
     */
    public function save(array $data): int
    {
        if (empty($data['total_amount']) || empty($data['currency_code']) || empty($data['status']) || empty($data['items'])) {
            throw new InvalidArgumentException("Invalid order data");
        }

        $this->db->beginTransaction();

        try {
            $stmt = $this->query("
                INSERT INTO orders (total_amount, currency_code, status)
                VALUES (:total_amount, :currency_code, :status)
            ", [
                'total_amount' => $data['total_amount'],
                'currency_code' => $data['currency_code'],
                'status' => $data['status']
            ]);

            $orderId = (int) $this->db->lastInsertId();

            foreach ($data['items'] as $item) {
                $this->query("
                    INSERT INTO order_items (order_id, product_id, product_name, attribute_values, quantity, paid_amount, currency_code)
                    VALUES (:order_id, :product_id, :product_name, :attribute_values, :quantity, :paid_amount, :currency_code)
                ", [
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'attribute_values' => json_encode($item['attribute_values']),
                    'quantity' => $item['quantity'],
                    'paid_amount' => $item['paid_amount'],
                    'currency_code' => $item['currency_code']
                ]);
            }

            $this->db->commit();
            return $orderId;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Get items for an order
     *
     * @param int $orderId
     * @return array
     * @throws InvalidArgumentException
     */
    public function items(int $orderId): array
    {
        if ($orderId <= 0) {
            throw new InvalidArgumentException("Order ID must be a positive integer");
        }

        return $this->fetchAll("SELECT * FROM order_items WHERE order_id = :order_id", ['order_id' => $orderId]);
    }
}