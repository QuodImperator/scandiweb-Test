<?php

namespace App\Model;

use PDO;
use InvalidArgumentException;
use Exception;

class Order extends Model
{
    public static function find(int $id): ?array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("Order ID must be a positive integer");
        }

        $instance = new self();
        return $instance->fetch("SELECT * FROM orders WHERE order_id = :id", ['id' => $id]);
    }

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

    public function items(int $orderId): array
    {
        if ($orderId <= 0) {
            throw new InvalidArgumentException("Order ID must be a positive integer");
        }

        return $this->fetchAll("SELECT * FROM order_items WHERE order_id = :order_id", ['order_id' => $orderId]);
    }
}