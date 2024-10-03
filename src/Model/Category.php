<?php

namespace App\Model;

use App\Database\Connection;
use PDO;

class Category
{
    private $db;

    public function __construct()
    {
        $this->db = Connection::getInstance()->getConnection();
    }

    public static function all()
    {
        $instance = new self();
        $stmt = $instance->db->query("SELECT * FROM categories");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find($id)
    {
        $instance = new self();
        $stmt = $instance->db->prepare("SELECT * FROM categories WHERE category_id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function products()
    {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE category_id = :category_id");
        $stmt->execute(['category_id' => $this->id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}