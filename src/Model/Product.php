<?php

namespace App\Model;

use App\Database\Connection;
use PDO;

class Product
{
    private $db;

    public function __construct()
    {
        $this->db = Connection::getInstance()->getConnection();
    }

    public static function all()
    {
        $instance = new self();
        $stmt = $instance->db->query("SELECT * FROM products");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find($id)
    {
        $instance = new self();
        $stmt = $instance->db->prepare("SELECT * FROM products WHERE product_id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function where($column, $value)
    {
        $instance = new self();
        $stmt = $instance->db->prepare("SELECT * FROM products WHERE $column = :value");
        $stmt->execute(['value' => $value]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function attributes()
    {
        $stmt = $this->db->prepare("
            SELECT a.*, pa.display_value, pa.value
            FROM attributes a
            JOIN product_attributes pa ON a.attribute_id = pa.attribute_id
            WHERE pa.product_id = :product_id
        ");
        $stmt->execute(['product_id' => $this->id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function prices()
    {
        $stmt = $this->db->prepare("
            SELECT p.*, c.label, c.symbol
            FROM prices p
            JOIN currencies c ON p.currency_code = c.currency_code
            WHERE p.product_id = :product_id
        ");
        $stmt->execute(['product_id' => $this->id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}