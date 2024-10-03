<?php

namespace App\Model;

use App\Database\Connection;
use PDO;

class CartItem
{
    private $db;

    public function __construct()
    {
        $this->db = Connection::getInstance()->getConnection();
    }

    public static function find($id)
    {
        $instance = new self();
        $stmt = $instance->db->prepare("SELECT * FROM cart_items WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function save($data)
    {
        $stmt = $this->db->prepare("
            INSERT INTO cart_items (product_id, quantity, attribute_values)
            VALUES (:product_id, :quantity, :attribute_values)
        ");
        $stmt->execute([
            'product_id' => $data['product_id'],
            'quantity' => $data['quantity'],
            'attribute_values' => json_encode($data['attribute_values'])
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data)
    {
        $stmt = $this->db->prepare("
            UPDATE cart_items
            SET quantity = :quantity
            WHERE id = :id
        ");
        return $stmt->execute([
            'id' => $id,
            'quantity' => $data['quantity']
        ]);
    }

    public function delete($id)
    {
        $stmt = $this->db->prepare("DELETE FROM cart_items WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}