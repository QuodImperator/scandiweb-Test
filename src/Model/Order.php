<?php
// src/Model/Order.php

namespace App\Model;

use PDO;
use InvalidArgumentException;

class Order extends Model
{
    public function save(array $orderData, array $orderItems): int
    {
        $this->db->beginTransaction();

        try {
            // Insert main order
            $stmt = $this->query("
                INSERT INTO orders (total_amount, currency_code, status, created_at, updated_at)
                VALUES (:total_amount, :currency_code, :status, NOW(), NOW())
            ", [
                'total_amount' => $orderData['total_amount'],
                'currency_code' => $orderData['currency_code'],
                'status' => $orderData['status']
            ]);

            $orderId = (int) $this->db->lastInsertId();

            // Insert order items
            foreach ($orderItems as $item) {
                $this->query("
                    INSERT INTO order_items (
                        order_id,
                        product_id,
                        product_name,
                        attribute_values,
                        quantity,
                        paid_amount,
                        currency_code,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        :order_id,
                        :product_id,
                        :product_name,
                        :attribute_values,
                        :quantity,
                        :paid_amount,
                        :currency_code,
                        NOW(),
                        NOW()
                    )
                ", array_merge($item, ['order_id' => $orderId]));
            }

            $this->db->commit();
            return $orderId;
        } catch (\Exception $e) {
            $this->db->rollBack();
            error_log('Error saving order: ' . $e->getMessage());
            throw $e;
        }
    }

    private function validateOrderData(array $data): void
    {
        if (!isset($data['total_amount']) || $data['total_amount'] <= 0) {
            throw new InvalidArgumentException('Invalid total amount');
        }
        if (empty($data['currency_code'])) {
            throw new InvalidArgumentException('Currency code is required');
        }
        if (empty($data['status'])) {
            throw new InvalidArgumentException('Status is required');
        }
        if (empty($data['items']) || !is_array($data['items'])) {
            throw new InvalidArgumentException('Order must contain items');
        }
    }

    public static function find(int $id): ?array
    {
        $instance = new self();
        return $instance->fetch("
            SELECT *
            FROM orders 
            WHERE order_id = :id
        ", ['id' => $id]);
    }
}