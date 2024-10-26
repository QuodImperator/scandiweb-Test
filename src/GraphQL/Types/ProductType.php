<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use App\Model\Category;
use App\Model\Product\ConfigurableProduct;
use App\Model\Product\SimpleProduct;
use App\Model\Abstract\AbstractProduct;

class ProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => function () {
                return [
                    'id' => [
                        'type' => TypeRegistry::nonNull(TypeRegistry::string()),
                        'resolve' => function ($product) {
                            return $product['product_id'];
                        }
                    ],
                    'name' => TypeRegistry::nonNull(TypeRegistry::string()),
                    'inStock' => [
                        'type' => TypeRegistry::nonNull(TypeRegistry::boolean()),
                        'resolve' => function ($product) {
                            return (bool)$product['is_in_stock'];
                        }
                    ],
                    'gallery' => [
                        'type' => TypeRegistry::listOf(TypeRegistry::string()),
                        'resolve' => function ($product) {
                            return json_decode($product['gallery'], true);
                        }
                    ],
                    'description' => TypeRegistry::string(),
                    'category' => [
                        'type' => TypeRegistry::category(),
                        'resolve' => function ($product) {
                            return Category::find($product['category_id']);
                        }
                    ],
                    'brand' => TypeRegistry::string(),
                    'prices' => [
                        'type' => TypeRegistry::listOf(TypeRegistry::price()),
                        'resolve' => function ($product) {
                            return $product['prices'];
                        }
                    ],
                    'attributes' => [
                        'type' => TypeRegistry::listOf(TypeRegistry::attribute()),
                        'resolve' => function ($product) {
                            $productInstance = $this->getProductInstance($product);
                            $attributes = $productInstance->getAttributes();
                            error_log("Resolved attributes: " . json_encode($attributes));
                            return $attributes;
                        }
                    ],
                ];
            }
        ]);
    }

    private function getProductInstance(array $product): AbstractProduct
    {
        $tempProduct = new ConfigurableProduct($product['product_id']);
        return $tempProduct->hasAttributes() ? 
            $tempProduct : 
            new SimpleProduct($product['product_id']);
    }
}