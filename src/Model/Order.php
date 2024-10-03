<?php

namespace App\Model;

use App\Database\Connection;
use PDO;

class Order
{
    private $db;

    public function __construct()
    {
        $this->db = Connection::getInstance()->getConnection();
    }

    public static function find($id)
    {
        $instance = new self();
        $stmt = $instance->db->prepare("SELECT * FROM orders WHERE order_id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        $this->db->beginTransaction();

        try {
            $stmt = $this->db->prepare("
                INSERT INTO orders (total_amount, currency_code, status)
                VALUES (:total_amount, :currency_code, :status)
            ");
            $stmt->execute([
                'total_amount' => $data['total_amount'],
                'currency_code' => $data['currency_code'],
                'status' => $data['status']
            ]);
            $orderId = $this->db->lastInsertId();

            foreach ($data['items'] as $item) {
                $stmt = $this->db->prepare("
                    INSERT INTO order_items (order_id, product_id, product_name, attribute_values, quantity, paid_amount, currency_code)
                    VALUES (:order_id, :product_id, :product_name, :attribute_values, :quantity, :paid_amount, :currency_code)
                ");
                $stmt->execute([
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
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function items($orderId)
    {
        $stmt = $this->db->prepare("SELECT * FROM order_items WHERE order_id = :order_id");
        $stmt->execute(['order_id' => $orderId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}