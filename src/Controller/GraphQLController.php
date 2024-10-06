<?php

namespace App\Controller;

use GraphQL\GraphQL;
use GraphQL\Type\Schema;
use App\GraphQL\Types\QueryType;
use App\GraphQL\Types\MutationType;
use App\GraphQL\Resolvers\Resolvers;

class GraphQLController
{
    public function handle()
    {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit(0);
        }

        // Create an instance of your Resolvers class
        $resolvers = new Resolvers();

        // Create the schema using your new QueryType and MutationType
        $schema = new Schema([
            'query' => new QueryType($resolvers),
            'mutation' => new MutationType($resolvers),
        ]);

        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);

        if (!isset($input['query'])) {
            $this->respondWithError('Query not provided');
            return;
        }

        $query = $input['query'];
        $variableValues = isset($input['variables']) ? $input['variables'] : null;

        try {
            $result = GraphQL::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();
        } catch (\Exception $e) {
            $this->respondWithError('GraphQL execution error: ' . $e->getMessage());
            return;
        }

        $this->respondWithJson($output);
    }

    private function respondWithError($message)
    {
        $this->respondWithJson(['errors' => [['message' => $message]]], 400);
    }

    private function respondWithJson($data, $statusCode = 200)
    {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($data);
    }
}