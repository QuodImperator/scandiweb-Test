<?php

namespace App\Model\Order;

use App\Model\Abstract\AbstractOrder;

class StandardOrder extends AbstractOrder
{
    protected function validateOrder(array $data): void
    {
        if (!isset($data['total_amount']) || $data['total_amount'] <= 0) {
            throw new \InvalidArgumentException('Invalid total amount');
        }
        if (empty($data['currency_code'])) {
            throw new \InvalidArgumentException('Currency code is required');
        }
        if (empty($data['status'])) {
            throw new \InvalidArgumentException('Status is required');
        }
        if (empty($data['items']) || !is_array($data['items'])) {
            throw new \InvalidArgumentException('Order must contain items');
        }
    }

    protected function processItems(int $orderId, array $items): void
    {
        foreach ($items as $item) {
            $this->query("
                INSERT INTO order_items (
                    order_id,
                    product_id,
                    product_name,
                    attribute_values,
                    quantity,
                    paid_amount,
                    currency_code,
                    created_at,
                    updated_at
                )
                VALUES (
                    :order_id,
                    :product_id,
                    :product_name,
                    :attribute_values,
                    :quantity,
                    :paid_amount,
                    :currency_code,
                    NOW(),
                    NOW()
                )
            ", array_merge($item, ['order_id' => $orderId]));
        }
    }
}