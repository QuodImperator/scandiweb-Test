<?php

namespace App\Model;

use PDO;
use InvalidArgumentException;

/**
 * Category Model
 * 
 * This class represents the Category entity and provides methods to interact with the categories table.
 */
class Category extends Model
{
    /**
     * Retrieve all categories
     *
     * @return array
     */
    public static function all(): array
    {
        $instance = new self();
        try {
            $categories = $instance->fetchAll("SELECT category_id, name FROM categories");
            error_log('Categories fetched from database: ' . json_encode($categories));
            return $categories;
        } catch (\PDOException $e) {
            error_log('Error fetching categories: ' . $e->getMessage());
            throw new \Exception('Failed to fetch categories: ' . $e->getMessage());
        }
    }

    /**
     * Find a category by its ID
     *
     * @param int $id
     * @return array|null
     * @throws InvalidArgumentException
     */
    public static function find(int $id): ?array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("Category ID must be a positive integer");
        }

        $instance = new self();
        return $instance->fetch("SELECT * FROM categories WHERE category_id = :id", ['id' => $id]);
    }

    /**
     * Get products for a category
     *
     * @param int $categoryId
     * @return array
     */
    public function products(int $categoryId): array
    {
        return $this->fetchAll("SELECT * FROM products WHERE category_id = :category_id", ['category_id' => $categoryId]);
    }
}