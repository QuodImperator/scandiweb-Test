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
        error_log('Entering Category::all() method');
        $instance = new self();
        try {
            error_log('Attempting to fetch categories');
            $categories = $instance->fetchAll("SELECT category_id, name FROM categories");
            error_log('Categories fetched from database: ' . json_encode($categories));
            return $categories ?: []; // Return an empty array if $categories is null or false
        } catch (\PDOException $e) {
            error_log('PDOException in Category::all(): ' . $e->getMessage());
            return []; // Return an empty array on error
        } catch (\Exception $e) {
            error_log('Exception in Category::all(): ' . $e->getMessage());
            return []; // Return an empty array on error
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