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
        error_log('Entering fetchAll method. SQL: ' . $sql);
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            error_log('fetchAll result: ' . json_encode($result));
            return $result;
        } catch (\PDOException $e) {
            error_log('PDOException in fetchAll: ' . $e->getMessage());
            throw $e;
        }
    }
}