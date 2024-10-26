<?php

namespace App\Model;

use App\Model\Abstract\AbstractModel;
use InvalidArgumentException;

class Category extends AbstractModel
{
    public static function all(): array
    {
        error_log('Entering Category::all() method');
        $instance = new self();
        try {
            error_log('Attempting to fetch categories');
            $categories = $instance->fetchAll("SELECT category_id, name FROM categories");
            error_log('Categories fetched from database: ' . json_encode($categories));
            return $categories ?: []; 
        } catch (\PDOException $e) {
            error_log('PDOException in Category::all(): ' . $e->getMessage());
            return []; 
        } catch (\Exception $e) {
            error_log('Exception in Category::all(): ' . $e->getMessage());
            return []; 
        }
    }

    public static function find(int $id): ?array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("Category ID must be a positive integer");
        }

        $instance = new self();
        return $instance->fetch("SELECT * FROM categories WHERE category_id = :id", ['id' => $id]);
    }

    public function products(int $categoryId): array
    {
        return $this->fetchAll("SELECT * FROM products WHERE category_id = :category_id", ['category_id' => $categoryId]);
    }
}