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
        $categories = Category::all();  // Returns an array
        return array_map(function($category) {
            return [
                'id' => $category['category_id'],
                'name' => $category['name'],
            ];
        }, $categories);
    }

    public function getCategory($args)
    {
        return Category::find($args['id']);
    }

    public function getProducts($args)
    {
        if (isset($args['categoryId'])) {
            return Product::where('category_id', $args['categoryId']);
        }
        return Product::all();
    }

    public function getProduct($args)
    {
        return Product::find($args['id']);
    }

    public function addToCart($args)
    {
        $cartItem = new CartItem();
        $id = $cartItem->save([
            'product_id' => $args['productId'],
            'quantity' => 1,
            'attribute_values' => $args['attributeValues']
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