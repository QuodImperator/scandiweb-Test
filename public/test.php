<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set the GraphQL endpoint (make sure this matches your route)
$url = 'http://localhost:8080/graphql';  // Adjust this to your actual GraphQL endpoint

// Define the GraphQL query you want to test
$query = '{
  __schema {
    types {
      name
    }
  }
}';

// Set up the request payload
$data = json_encode(['query' => $query]);

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'Content-Length: ' . strlen($data)
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

// Execute the request
$response = curl_exec($ch);

// Check for cURL errors
if ($response === false) {
  echo 'cURL error: ' . curl_error($ch);
} else {
  // Output the raw response
  echo '<pre>';
  var_dump($response);  // Use var_dump to see the raw response.
  echo '</pre>';
}

// Close cURL
curl_close($ch);