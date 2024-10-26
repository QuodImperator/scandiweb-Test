<?php

namespace App\GraphQL\Resolvers;

use App\Model\Category;
use App\Model\CartItem;
use App\Model\Product\ConfigurableProduct;
use App\Model\Product\SimpleProduct;
use App\Model\Order\StandardOrder;
use App\Model\Attribute\ColorAttribute;
use App\Model\Attribute\SizeAttribute;
use App\Model\Abstract\AbstractProduct;
use App\Model\Abstract\AbstractModel;

class Resolvers extends AbstractModel
{
    public function getCategories()
    {
        error_log('Entering Resolvers::getCategories()');
        try {
            $categories = Category::all();
            error_log('Categories from Category::all(): ' . json_encode($categories));
            return $categories ?: [];
        } catch (\Exception $e) {
            error_log('Exception in Resolvers::getCategories(): ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return [];
        }
    }

    public function getCategory($args)
    {
        return Category::find((int)$args['id']);
    }

    private function getProductInstance(array $product): AbstractProduct
    {
        $hasAttributes = !empty($product['attributes']) || 
                        !empty($product['configurable_attributes']);
        
        return $hasAttributes ? 
            new ConfigurableProduct($product['product_id']) : 
            new SimpleProduct($product['product_id']);
    }

    public function getProducts($rootValue, $args)
    {
        $categoryId = $args['categoryId'] ?? null;
        if ($categoryId === 'all') {
            $categoryId = null;
        } elseif ($categoryId !== null) {
            $categoryId = (int)$categoryId;
        }

        // Get basic product data
        $query = "SELECT * FROM products";
        $params = [];
        
        if ($categoryId !== null) {
            $query .= " WHERE category_id = :category_id";
            $params['category_id'] = $categoryId;
        }

        $products = $this->fetchAll($query, $params);

        // Enhance products with type-specific data
        return array_map(function($product) {
            $productInstance = $this->getProductInstance($product);
            $productData = $productInstance->find($product['product_id']);
            
            if ($productData) {
                $productData['prices'] = array_map(function ($price) {
                    return [
                        'amount' => (float)$price['amount'],
                        'currency' => [
                            'symbol' => $price['symbol'],
                            'label' => $price['label']
                        ]
                    ];
                }, $productInstance->getPrice());
            }
            
            return $productData;
        }, $products);
    }

    public function getProduct($rootValue, $args)
    {
        // First fetch basic product info to determine type
        $productData = $this->fetch(
            "SELECT * FROM products WHERE product_id = :id",
            ['id' => $args['id']]
        );

        if (!$productData) {
            return null;
        }

        // Create appropriate product instance
        $product = $this->getProductInstance($productData);
        $fullProductData = $product->find($args['id']);

        if ($fullProductData) {
            $fullProductData['prices'] = array_map(function ($price) {
                return [
                    'amount' => (float)$price['amount'],
                    'currency' => [
                        'symbol' => $price['symbol'],
                        'label' => $price['label']
                    ]
                ];
            }, $product->getPrice());
        }

        return $fullProductData;
    }

    public function placeOrder($rootValue, $args)
    {
        try {
            error_log('Placing order with args: ' . json_encode($args));

            $order = new StandardOrder();
            $orderItems = [];

            foreach ($args['items'] as $item) {
                $productData = $this->fetch(
                    "SELECT * FROM products WHERE product_id = :id",
                    ['id' => $item['productId']]
                );
                
                if (!$productData) {
                    throw new \Exception('Product not found: ' . $item['productId']);
                }

                $product = $this->getProductInstance($productData);
                $fullProductData = $product->find($item['productId']);

                $itemTotal = $product->getPrice()[0]['amount'] * $item['quantity'];

                // Format attribute values for storage
                $attributes = [];
                if (!empty($item['attributeValues'])) {
                    foreach ($item['attributeValues'] as $attr) {
                        $attributes[$attr['name']] = $attr['value'];
                    }
                }

                $orderItems[] = [
                    'product_id' => $item['productId'],
                    'product_name' => $fullProductData['name'],
                    'quantity' => $item['quantity'],
                    'paid_amount' => $itemTotal,
                    'currency_code' => 'USD',
                    'attribute_values' => json_encode($attributes)
                ];
            }

            $totalAmount = array_sum(array_column($orderItems, 'paid_amount'));

            $orderData = [
                'total_amount' => $totalAmount,
                'currency_code' => 'USD',
                'status' => 'pending',
                'items' => $orderItems
            ];

            error_log('Creating order with data: ' . json_encode($orderData));
            $orderId = $order->save($orderData, $orderItems);

            return [
                'order_id' => $orderId,
                'total_amount' => $totalAmount,
                'currency_code' => 'USD',
                'status' => 'pending',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];
        } catch (\Exception $e) {
            error_log('Error placing order: ' . $e->getMessage());
            throw $e;
        }
    }
}