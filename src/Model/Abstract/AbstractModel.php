<?php

namespace App\Model\Abstract;

use PDO;
use App\Database\Connection;

abstract class AbstractModel
{
    protected $db;

    public function __construct()
    {
        $this->db = Connection::getInstance()->getConnection();
    }

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
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (\PDOException $e) {
            error_log('PDOException in fetchAll: ' . $e->getMessage());
            throw $e;
        }
    }
}