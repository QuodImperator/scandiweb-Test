<?php

namespace App\Controller;

use GraphQL\GraphQL;
use GraphQL\Type\Schema;
use GraphQL\Utils\BuildSchema;
use App\GraphQL\Resolvers\Resolvers;

class GraphQLController
{
    public function handle()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");

        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit(0);
        }

        // Read the schema file
        $schemaFile = __DIR__ . '/../GraphQL/Schema/schema.graphql';
        $schemaContents = file_get_contents($schemaFile);

        // Build the schema
        $schema = BuildSchema::build($schemaContents);

        // Set up resolvers
        $rootValue = [
            'categories' => [new Resolvers(), 'getCategories'],
            'category' => [new Resolvers(), 'getCategory'],
            'products' => [new Resolvers(), 'getProducts'],
            'product' => [new Resolvers(), 'getProduct'],
            'addToCart' => [new Resolvers(), 'addToCart'],
            'removeFromCart' => [new Resolvers(), 'removeFromCart'],
            'updateCartItemQuantity' => [new Resolvers(), 'updateCartItemQuantity'],
            'placeOrder' => [new Resolvers(), 'placeOrder'],
        ];

        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        $query = $input['query'];
        $variableValues = isset($input['variables']) ? $input['variables'] : null;

        try {
            $result = GraphQL::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (\Exception $e) {
            $output = [
                'errors' => [
                    [
                        'message' => $e->getMessage()
                    ]
                ]
            ];
        }

        header('Content-Type: application/json');
        echo json_encode($output);
    }
}