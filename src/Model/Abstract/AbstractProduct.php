<?php

namespace App\Model\Abstract;

abstract class AbstractProduct extends AbstractModel
{
    protected string $productId;
    protected bool $inStock = false; // Set default value

    abstract public function getPrice(): array;
    abstract public function getAttributes(): array;
    abstract public function isInStock(): bool;

    public function __construct(string $productId = '')
    {
        parent::__construct();
        $this->productId = $productId;
        $this->loadProductData();
    }

    protected function loadProductData(): void
    {
        if (empty($this->productId)) {
            return;
        }

        $product = $this->fetch(
            "SELECT * FROM products WHERE product_id = :id",
            ['id' => $this->productId]
        );

        if ($product) {
            // Check for is_in_stock column, if not found, check stock_status or any other relevant column
            $this->inStock = (bool) ($product['is_in_stock'] ?? $product['stock_status'] ?? false);
            
            // Log the stock status for debugging
            error_log("Product {$this->productId} stock status: " . ($this->inStock ? 'true' : 'false'));
            error_log("Product data: " . json_encode($product));
        }
    }

    public function find(string $id): ?array
    {
        $this->productId = $id;
        $this->loadProductData();
        
        $product = $this->fetch(
            "SELECT * FROM products WHERE product_id = :id",
            ['id' => $id]
        );
        
        if ($product) {
            // Ensure we're setting the stock status in the returned array too
            $product['is_in_stock'] = $this->inStock;
            $product['prices'] = $this->getPrice();
            $product['attributes'] = $this->getAttributes();
            $product['category'] = $this->getCategory($product['category_id']);
        }
        
        return $product;
    }

    protected function getCategory(int $categoryId): ?array
    {
        return $this->fetch(
            "SELECT * FROM categories WHERE category_id = :id",
            ['id' => $categoryId]
        );
    }
}