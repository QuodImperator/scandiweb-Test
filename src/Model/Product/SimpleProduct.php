<?php

namespace App\Model\Product;

use App\Model\Abstract\AbstractProduct;

class SimpleProduct extends AbstractProduct
{
    public function getPrice(): array
    {
        if (empty($this->productId)) {
            return [];
        }

        return $this->fetchAll("
            SELECT p.amount, c.symbol, c.currency_code as label
            FROM prices p
            JOIN currencies c ON p.currency_code = c.currency_code
            WHERE p.product_id = :product_id
        ", ['product_id' => $this->productId]);
    }

    public function getAttributes(): array
    {
        return [];
    }

    public function isInStock(): bool
    {
        return $this->inStock;
    }
}