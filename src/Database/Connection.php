<?php

namespace App\Database;

use PDO;
use PDOException;
use Exception;

class Connection
{
    private static $instance = null;
    private $conn;

    private function __construct()
    {
        try {
            $host = $_ENV['DB_HOST'];
            $db   = $_ENV['DB_NAME'];
            $user = $_ENV['DB_USER'];
            $pass = $_ENV['DB_PASS'];
            $charset = 'utf8mb4';
    
            $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
    
            $this->conn = new PDO($dsn, $user, $pass, $options);
            error_log('Database connection established successfully');
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    public static function getInstance()
    {
        if (self::$instance == null) {
            try {
                self::$instance = new Connection();
            } catch (PDOException $e) {
                error_log('Database connection failed: ' . $e->getMessage());
                throw $e;
            }
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->conn;
    }

    // Prevent cloning of the instance
    private function __clone() {}

    // Prevent unserializing of the instance
    public function __wakeup()
    {
        throw new Exception("Cannot unserialize singleton");
    }
}