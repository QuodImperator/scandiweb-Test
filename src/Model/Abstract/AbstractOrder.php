<?php

namespace App\Model\Abstract;

abstract class AbstractOrder extends AbstractModel
{
    abstract protected function validateOrder(array $data): void;
    abstract protected function processItems(int $orderId, array $items): void;

    public function save(array $orderData, array $orderItems): int
    {
        $this->db->beginTransaction();

        try {
            $this->validateOrder($orderData);
            
            $stmt = $this->query("
                INSERT INTO orders (total_amount, currency_code, status, created_at, updated_at)
                VALUES (:total_amount, :currency_code, :status, NOW(), NOW())
            ", [
                'total_amount' => $orderData['total_amount'],
                'currency_code' => $orderData['currency_code'],
                'status' => $orderData['status']
            ]);

            $orderId = (int) $this->db->lastInsertId();
            $this->processItems($orderId, $orderItems);

            $this->db->commit();
            return $orderId;
        } catch (\Exception $e) {
            $this->db->rollBack();
            error_log('Error saving order: ' . $e->getMessage());
            throw $e;
        }
    }
}