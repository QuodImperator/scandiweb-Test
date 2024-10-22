<?php

namespace App\GraphQL\Resolvers;

use App\Model\Category;
use App\Model\Product;
use App\Model\CartItem;
use App\Model\Order;
use App\Model\Attribute;

class Resolvers
{
    public function getCategories()
    {
        error_log('Entering Resolvers::getCategories()');
        try {
            $categories = Category::all();
            error_log('Categories from Category::all(): ' . json_encode($categories));
            return $categories ?: []; // Return an empty array if $categories is null or false
        } catch (\Exception $e) {
            error_log('Exception in Resolvers::getCategories(): ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return []; // Return an empty array on error
        }
    }

    public function getCategory($args)
    {
        return Category::find((int)$args['id']);
    }

    public function getProducts($rootValue, $args)
    {
        $categoryId = $args['categoryId'] ?? null;
        if ($categoryId === 'all') {
            $categoryId = null;
        } elseif ($categoryId !== null) {
            $categoryId = (int)$categoryId;
        }
        $products = Product::getProductsWithPrices($categoryId);

        foreach ($products as &$product) {
            $product['prices'] = array_map(function ($price) {
                return [
                    'amount' => (float)$price['amount'],
                    'currency' => [
                        'symbol' => $price['symbol'],
                        'label' => $price['label']
                    ]
                ];
            }, $product['prices']);
        }

        return $products;
    }

    public function getProduct($rootValue, $args)
    {
        $product = Product::find($args['id']);
        if ($product) {
            $product['prices'] = array_map(function ($price) {
                return [
                    'amount' => (float)$price['amount'],
                    'currency' => [
                        'symbol' => $price['symbol'],
                        'label' => $price['label']
                    ]
                ];
            }, $product['prices']);
            $product['attributes'] = Attribute::getByProductId($product['product_id']);
        }
        return $product;
    }

    public function addToCart($args)
    {
        $cartItem = new CartItem();
        $id = $cartItem->save([
            'product_id' => $args['productId'],
            'quantity' => 1,
            'attribute_values' => array_map(function ($attr) {
                return ['id' => $attr['id'], 'value' => $attr['value']];
            }, $args['attributeValues'])
        ]);
        return CartItem::find($id);
    }

    public function removeFromCart($args)
    {
        $cartItem = new CartItem();
        return $cartItem->delete($args['cartItemId']);
    }

    public function updateCartItemQuantity($args)
    {
        $cartItem = new CartItem();
        $success = $cartItem->update($args['cartItemId'], ['quantity' => $args['quantity']]);
        return $success ? CartItem::find($args['cartItemId']) : null;
    }

    public function placeOrder($rootValue, $args)
    {
        try {
            error_log('Placing order with args: ' . json_encode($args));

            $order = new Order();
            $orderItems = [];

            foreach ($args['items'] as $item) {
                $product = Product::find($item['productId']);
                if (!$product) {
                    throw new \Exception('Product not found: ' . $item['productId']);
                }

                $itemTotal = $product['prices'][0]['amount'] * $item['quantity'];

                // Format attribute values for storage
                $attributes = [];
                if (!empty($item['attributeValues'])) {
                    foreach ($item['attributeValues'] as $attr) {
                        $attributes[$attr['name']] = $attr['value'];
                    }
                }

                $orderItems[] = [
                    'product_id' => $item['productId'],
                    'product_name' => $product['name'],
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
                'status' => 'pending'
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
