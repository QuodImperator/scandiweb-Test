<?php

return [
    'host' => $_ENV['DB_HOST'] ?? 'sql103.infinityfree.com',
    'dbname' => $_ENV['DB_NAME'] ?? 'if0_37596803_scandi_base',
    'user' => $_ENV['DB_USER'] ?? 'if0_37596803',
    'password' => $_ENV['DB_PASS'] ?? '951951DarePLS',
    'port' => $_ENV['DB_PORT'] ?? '3306',
    'charset' => 'utf8mb4',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
];