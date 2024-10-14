<?php

namespace App\GraphQL\Resolvers;

use App\Model\Category;
use App\Model\Product;
use App\Model\CartItem;
use App\Model\Order;

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

    public function placeOrder($args)
    {
        $order = new Order();
        $orderId = $order->save([
            'total_amount' => 0, // Calculate this based on cart items
            'currency_code' => 'USD', // Get this from somewhere
            'status' => 'PENDING',
            'items' => $args['cartItems']
        ]);
        return Order::find($orderId);
    }
}