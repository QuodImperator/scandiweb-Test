<?php

namespace App\Model;

use App\Database\Connection;
use PDO;

abstract class Model
{
    protected $db;

    public function __construct()
    {
        $this->db = Connection::getInstance()->getConnection();
    }

    // Common methods that all models might use can go here
    protected function query($sql, $params = [])
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    protected function fetch($sql, $params = [])
    {
        return $this->query($sql, $params)->fetch(PDO::FETCH_ASSOC);
    }

    protected function fetchAll($sql, $params = [])
    {
        return $this->query($sql, $params)->fetchAll(PDO::FETCH_ASSOC);
    }
}