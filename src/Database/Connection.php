<?php

namespace App\Database;

use PDO;
use PDOException;

class Connection
{
    private static $instance = null;
    private $conn;

    private function __construct()
    {
        $dbConfig = $this->loadConfig();
        $dsn = "mysql:host={$dbConfig['host']};dbname={$dbConfig['dbname']};charset={$dbConfig['charset']}";

        try {
            $this->conn = new PDO($dsn, $dbConfig['user'], $dbConfig['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            error_log('Database connection established successfully');
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            throw new PDOException('Database connection failed: ' . $e->getMessage(), (int)$e->getCode());
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->conn;
    }

    private function loadConfig()
    {
        // You can adjust this path as needed
        $configPath = __DIR__ . '/../config/database.php';
        
        if (!file_exists($configPath)) {
            throw new \RuntimeException('Database configuration file not found');
        }

        $config = require $configPath;

        $requiredKeys = ['host', 'dbname', 'user', 'password', 'charset'];
        foreach ($requiredKeys as $key) {
            if (!isset($config[$key])) {
                throw new \RuntimeException("Missing required configuration key: $key");
            }
        }

        return $config;
    }

    // Prevent cloning of the instance
    private function __clone() {}

    // Prevent unserializing of the instance
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize singleton");
    }
}