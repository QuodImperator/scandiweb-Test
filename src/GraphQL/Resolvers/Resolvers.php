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
        return Category::all();
    }

    public function getCategory($root, $args)
    {
        return Category::find($args['id']);
    }

    public function getProducts($root, $args)
    {
        if (isset($args['categoryId'])) {
            return Product::where('category_id', $args['categoryId'])->get();
        }
        return Product::all();
    }

    public function getProduct($root, $args)
    {
        return Product::find($args['id']);
    }

    public function addToCart($root, $args)
    {
        $product = Product::find($args['productId']);
        $cartItem = new CartItem([
            'product_id' => $product->id,
            'quantity' => 1,
            'attribute_values' => json_encode($args['attributeValues'])
        ]);
        $cartItem->save();
        return $cartItem;
    }

    public function removeFromCart($root, $args)
    {
        $cartItem = CartItem::find($args['cartItemId']);
        if ($cartItem) {
            $cartItem->delete();
            return true;
        }
        return false;
    }

    public function updateCartItemQuantity($root, $args)
    {
        $cartItem = CartItem::find($args['cartItemId']);
        if ($cartItem) {
            $cartItem->quantity = $args['quantity'];
            $cartItem->save();
            return $cartItem;
        }
        return null;
    }

    public function placeOrder($root, $args)
    {
        $order = new Order();
        $order->status = 'PENDING';
        $order->save();

        $total = 0;
        foreach ($args['cartItems'] as $item) {
            $product = Product::find($item['productId']);
            $orderItem = $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'attribute_values' => json_encode($item['attributeValues']),
                'price' => $product->prices->first()->amount
            ]);
            $total += $orderItem->price * $orderItem->quantity;
        }

        $order->total = $total;
        $order->save();

        return $order;
    }
}
