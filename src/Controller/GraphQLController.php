<?php

namespace App\Controller;

use GraphQL\GraphQL;
use GraphQL\Type\Schema;
use App\GraphQL\Types\QueryType;
use App\GraphQL\Types\MutationType;
use App\GraphQL\Resolvers\Resolvers;

class GraphQLController
{

    private $resolvers;

    public function __construct()
    {
        $this->resolvers = new Resolvers();
    }

    public function handle()
    {
        try {
            $schema = new Schema([
                'query' => new QueryType($this->resolvers),
                'mutation' => new MutationType($this->resolvers),
            ]);
    
            $input = json_decode(file_get_contents('php://input'), true);
            $query = $input['query'];
            $variableValues = isset($input['variables']) ? $input['variables'] : null;
    
            $result = GraphQL::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();
    
            error_log('GraphQL result: ' . json_encode($output));
        } catch (\Exception $e) {
            error_log('GraphQL execution error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            $output = [
                'errors' => [
                    [
                        'message' => 'GraphQL execution error: ' . $e->getMessage(),
                        'locations' => [['line' => $e->getLine(), 'column' => 0]],
                        'path' => null,
                        'trace' => $e->getTraceAsString()
                    ]
                ]
            ];
        }
    
        header('Content-Type: application/json');
        echo json_encode($output);
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
